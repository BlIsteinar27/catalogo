# Prompt para Devin: Fix ImageZoom Close Button en Móvil

## Contexto

El componente `ImageZoom` (`src/components/catalog/image-zoom.tsx`) tiene un bug donde el botón de cerrar (X) no responde consistentemente en dispositivos móviles. El problema es intermitente: a veces funciona, a veces no. En desktop no se reportan problemas.

Los componentes `Modal` (`src/components/ui/modal.tsx`) y `CartDrawer` (`src/components/cart/cart-drawer.tsx`) funcionan perfectamente en las mismas condiciones móviles, por lo que el problema es específico de la implementación de `ImageZoom`.

## Análisis del Problema (ya realizado)

La causa raíz es una **sobrecarga de complejidad en un solo contenedor** que colapsa en eventos táctiles. Los fallos identificados son:

1. **Overlay y contenido en el mismo `motion.div`**: El `onClick` del overlay compite con el `onClick` del botón X en el mismo contenedor. En eventos táctiles (con delay de ~300ms), el target del click puede cambiar antes de que el evento se ejecute.
2. **`<motion.button>` con `whileTap` en el botón de cerrar**: La animación de escala (`scale: 0.9`) combinada con el delay táctil hace que el elemento se transforme visualmente antes de que el evento `click` se dispare. El navegador pierde la referencia al target original.
3. **`stopPropagation` en el div de la imagen**: Interfiere con la propagación de eventos táctiles. En ciertos navegadores móviles, `stopPropagation` en un elemento hijo puede bloquear eventos necesarios para que el botón X reciba su `onClick`.
4. **Timeouts de focus management (100ms / 200ms)**: Crean condiciones de carrera. El focus se fuerza al botón X justo cuando el usuario está a punto de tocarlo, desplazando el viewport o cambiando el stacking context.
5. **Trampa de foco restrictiva**: El querySelector específico no captura correctamente el estado del DOM durante las transiciones de animación.

## Arquitectura de Referencia (componentes que funcionan)

### Modal (`src/components/ui/modal.tsx`)
- Overlay separado del contenido en dos `motion.div` hermanos del mismo nivel
- Overlay tiene `onClick={onClose}` y `aria-hidden="true"`
- Contenido del modal NO tiene `onClick`
- Botón de cerrar es `<button>` normal (NO `<motion.button>`)
- Sin timeouts de focus
- Sin `stopPropagation`

### CartDrawer (`src/components/cart/cart-drawer.tsx`)
- Overlay separado del drawer en dos `motion.div` hermanos
- Overlay tiene `onClick={closeCart}` y `aria-hidden="true"`
- Drawer NO tiene `onClick` en el contenedor
- Botón de cerrar es `<button>` normal
- Focus management simple: sin timeouts, directo e inmediato
- Trampa de foco con querySelector amplio: `'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'`

## Instrucciones de Implementación

### 1. Reestructurar el DOM del overlay

El componente actual tiene overlay y contenido en el mismo `motion.div`. Debe separarse en dos elementos hermanos del mismo nivel dentro de `AnimatePresence`:

```
<AnimatePresence>
  {isZoomed && (
    <>
      {/* Overlay: clickeable, cierra al hacer click */}
      <motion.div onClick={handleOverlayClick} aria-hidden="true" />

      {/* Contenido: contiene la imagen y el botón X */}
      <motion.div>
        <div role="dialog" aria-modal="true">
          <button onClick={handleCloseClick}>X</button>
          <Image />
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Reglas del overlay:**
- Debe ser un `motion.div` separado con animación de `opacity` (0 → 1 → 0)
- Debe tener `onClick={() => setIsZoomed(false)}`
- Debe tener `aria-hidden="true"`
- Debe tener `z-50` y `fixed inset-0`
- Debe tener `bg-black/90`

**Reglas del contenedor de contenido:**
- Debe ser un `motion.div` separado con animación de `scale` y `opacity`
- Debe tener `className="fixed inset-0 z-50 flex items-center justify-center p-4"`
- Debe tener `pointer-events-none` para que los clicks pasen al overlay cuando el usuario toca fuera de la imagen
- El contenedor interno (el que tiene `role="dialog"`) debe tener `pointer-events-auto` para que la imagen y el botón X sean interactivos

### 2. Cambiar el botón de cerrar a `<button>` normal

El botón de cerrar actual es `<motion.button>` con `whileHover`, `whileTap`, `initial`, `animate`, `exit`. Todo eso debe eliminarse.

**Reemplazar por:**
```tsx
<button
  onClick={handleCloseClick}
  className="absolute top-4 right-4 z-50 rounded-full bg-glass p-2 text-white hover:bg-glass-border transition-colors backdrop-blur-md border border-glass-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90"
  type="button"
  aria-label="Cerrar imagen ampliada"
>
  <X size={24} />
</button>
```

**Importante:** El botón debe tener `z-50` para asegurar que esté por encima de la imagen.
**Importante:** El handler debe ser `handleCloseClick` que hace `e.stopPropagation()` y luego `setIsZoomed(false)`. Esto evita que el click en el botón X burbujee al overlay.

### 3. Eliminar `stopPropagation` de la imagen

La imagen ampliada NO debe tener `stopPropagation`. El contenedor de la imagen está dentro del `pointer-events-auto`, por lo que un click en la imagen no llegará al overlay de todos modos. Si se mantiene `stopPropagation`, puede interferir con eventos táctiles en móviles.

### 4. Simplificar el focus management

Eliminar TODOS los `setTimeout` del focus management.

**Reemplazar por:**
```tsx
useEffect(() => {
  if (isZoomed) {
    previousActiveElementRef.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();
  } else {
    if (triggerRef.current && document.body.contains(triggerRef.current)) {
      triggerRef.current.focus();
    }
  }
}, [isZoomed]);
```

### 5. Simplificar la trampa de foco

Reemplazar el querySelector específico por el querySelector amplio que usa CartDrawer:

```tsx
const focusable = dialogRef.current!.querySelectorAll<HTMLElement>(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
```

### 6. Mantener la API del componente

El componente debe seguir exportando `ImageZoom` con las mismas props:
```tsx
interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}
```

### 7. Preservar el trigger original

El trigger (la imagen pequeña que se muestra en la página de producto) debe seguir funcionando exactamente igual. Es un `<button>` que contiene una `<Image>` de Next.js. Asegúrate de que:
- El `ref={triggerRef}` siga en el botón trigger
- El `onClick={() => setIsZoomed(true)}` siga funcionando
- La imagen del trigger se siga viendo correctamente en la página de producto
- Las clases del trigger (`className`) se pasen correctamente

### 8. Preservar el comportamiento de la imagen ampliada

La imagen ampliada debe:
- Usar `fill` y `object-contain` (NO `object-cover`)
- Tener `sizes="(max-width: 768px) 100vw, 80vw"`
- Tener `priority`
- Estar contenida en un div con `relative h-full w-full`

## Comportamiento Esperado Final

1. Usuario hace tap en la imagen del producto → se abre el zoom
2. Aparece overlay negro + imagen ampliada + botón X
3. Usuario hace tap en el botón X → se cierra el zoom **inmediatamente**, sin intermitencia
4. Usuario hace tap en el fondo negro (overlay) → se cierra el zoom
5. Usuario hace tap en la imagen ampliada → NO se cierra el zoom
6. Tecla Escape → cierra el zoom
7. Tab → queda atrapado dentro del dialog
8. Al cerrar, el focus vuelve al trigger original

## Archivos a Modificar

- `src/components/catalog/image-zoom.tsx` (reemplazo completo del componente)

## Archivos de Referencia (NO modificar, solo leer)

- `src/components/ui/modal.tsx` (patrón de overlay separado)
- `src/components/cart/cart-drawer.tsx` (patrón de focus management simple)
- `src/app/producto/[id]/page-client.tsx` (donde se usa ImageZoom, verificar que la imagen sigue visible)

## Verificación Post-Cambio

1. Abre la página de un producto (`/producto/[id]`)
2. Confirma que la imagen del producto se ve correctamente (NO debe desaparecer)
3. Haz click en la imagen → debe abrirse el zoom
4. En DevTools, activa vista móvil (Responsive, 320px-768px)
5. Haz click en el botón X → debe cerrarse inmediatamente, 10 de 10 veces
6. Haz click en el overlay → debe cerrarse
7. Haz click en la imagen ampliada → NO debe cerrarse
8. Presiona Escape → debe cerrarse
9. Verifica que no hay errores en la consola
