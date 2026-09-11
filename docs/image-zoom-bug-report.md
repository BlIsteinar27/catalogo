# Reporte de Bug: Botón de Cerrar en ImageZoom No Responde Consistentemente

## Contexto del Problema

**Componente afectado:** `ImageZoom` (`src/components/catalog/image-zoom.tsx`)

**Síntoma:** El botón de cerrar (X) en el zoom de imagen no responde consistentemente en dispositivos móviles. El usuario reporta que:
- Al grabar pantalla desde el teléfono, el botón de cerrar parece no funcionar
- Al probar desde la vista móvil en el navegador, funciona "de vez en cuando" pero presenta el mismo problema intermitente
- El problema parece ser un "bug silencioso" relacionado con estados o referencias

**Contexto importante:** Este problema NO ocurre con:
- El botón para cerrar el modal (`src/components/ui/modal.tsx`)
- El botón para cerrar el drawer del carrito (`src/components/cart/cart-drawer.tsx`)

Esos componentes funcionan perfectamente en las mismas condiciones móviles.

## Análisis Comparativo de Componentes

### ImageZoom (Componente Problemático)

**Ubicación:** `src/components/catalog/image-zoom.tsx`

**Características principales:**
```typescript
- Estado: `isZoomed` (boolean)
- Referencias: `closeButtonRef`, `triggerButtonRef`, `dialogRef`
- Librería: motion/react para animaciones
- Focus management: Complejo con timeouts
```

**Estructura del componente:**
1. Botón trigger para abrir el zoom
2. Overlay/dialog con animación de entrada/salida
3. Botón de cerrar (X) en posición absoluta
4. Imagen contenida en un div con `stopPropagation`

**Focus management actual:**
```typescript
useEffect(() => {
  if (isZoomed) {
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  } else if (triggerButtonRef.current && document.body.contains(triggerButtonRef.current)) {
    const timer = setTimeout(() => {
      triggerButtonRef.current?.focus()
    }, 200)
    return () => clearTimeout(timer)
  }
}, [isZoomed])
```

**Trampa de foco (focus trap):**
```typescript
useEffect(() => {
  if (!isZoomed || !dialogRef.current) return

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusableElements = dialogRef.current!.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    // ... lógica de trampa de foco
  }

  document.addEventListener('keydown', handleTab)
  return () => document.removeEventListener('keydown', handleTab)
}, [isZoomed])
```

**Estructura del botón de cerrar:**
```typescript
<motion.button
  ref={closeButtonRef}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => setIsZoomed(false)}
  className="absolute top-4 right-4 rounded-full bg-glass p-2 text-white hover:bg-glass-border transition-colors backdrop-blur-md border border-glass-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90"
  type="button"
  aria-label="Cerrar imagen ampliada"
>
  <MotionX size={24} />
</motion.button>
```

**Overlay con onClick:**
```typescript
<motion.div
  ref={dialogRef}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={() => setIsZoomed(false)}  // ← Primer onClick handler
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
  role="dialog"
  aria-modal="true"
  aria-label="Imagen ampliada"
>
  {/* Botón de cerrar con onClick={() => setIsZoomed(false)} ← Segundo onClick handler */}
  {/* Imagen con stopPropagation */}
  <motion.div
    onClick={(e) => e.stopPropagation()}  // ← stopPropagation
    className="relative h-full max-w-4xl max-h-[90vh] w-full"
  >
    <Image ... />
  </motion.div>
</motion.div>
```

### Modal (Componente que Funciona Bien)

**Ubicación:** `src/components/ui/modal.tsx`

**Características principales:**
```typescript
- Props: `isOpen`, `onClose`, `title`, `children`
- Sin focus management complejo
- Sin timeouts
- Sin trampa de foco
```

**Estructura del botón de cerrar:**
```typescript
<button
  onClick={onClose}
  className="p-1 rounded-sm text-ink-secondary hover:bg-surface transition-colors"
  aria-label="Cerrar"
>
  <X size={18} />
</button>
```

**Overlay separado del contenido:**
```typescript
<>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
  />
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    {/* Contenido del modal */}
  </motion.div>
</>
```

### CartDrawer (Componente que Funciona Bien)

**Ubicación:** `src/components/cart/cart-drawer.tsx`

**Características principales:**
```typescript
- Estado: gestionado por `useCart` hook
- Referencias: `drawerRef`, `previousActiveElementRef`
- Focus management: Simple sin timeouts
- Trampa de foco: Presente pero más simple
```

**Focus management (sin timeouts):**
```typescript
useEffect(() => {
  if (isOpen) {
    previousActiveElementRef.current = document.activeElement as HTMLElement
    drawerRef.current?.focus()
  } else {
    previousActiveElementRef.current?.focus()
  }
}, [isOpen])
```

**Estructura del botón de cerrar:**
```typescript
<button
  onClick={closeCart}
  className="rounded-sm p-1.5 text-ink-muted hover:bg-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors"
  aria-label="Cerrar carrito"
>
  <X size={18} aria-hidden="true" />
</button>
```

**Overlay separado del drawer:**
```typescript
<>
  <motion.div
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    onClick={closeCart}
    aria-hidden="true"
  />
  <motion.div
    ref={drawerRef}
    role="dialog"
    aria-modal="true"
    aria-label="Carrito de compras"
    id="cart-drawer"
    className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-surface-elevated shadow-glass-lg backdrop-blur-md"
    // ...
  >
    {/* Contenido del drawer */}
  </motion.div>
</>
```

## Diferencias Clave Identificadas

### 1. Timeouts en Focus Management
**ImageZoom:** Usa timeouts de 100ms y 200ms para focus management
**Modal:** No usa timeouts
**CartDrawer:** No usa timeouts

### 2. Múltiples onClick Handlers
**ImageZoom:** Tiene onClick tanto en el overlay como en el botón de cerrar
**Modal:** Tiene onClick solo en el overlay separado
**CartDrawer:** Tiene onClick solo en el overlay separado

### 3. stopPropagation en Imagen
**ImageZoom:** Usa `stopPropagation` en el div de la imagen
**Modal:** No usa stopPropagation
**CartDrawer:** No usa stopPropagation

### 4. Complejidad de Trampa de Foco
**ImageZoom:** Trampa de foco compleja con querySelector específico
**Modal:** No tiene trampa de foco
**CartDrawer:** Trampa de foco más simple con querySelector más amplio

### 5. Estructura del Overlay
**ImageZoom:** Overlay y contenido en el mismo motion.div
**Modal:** Overlay separado del contenido en dos motion.div diferentes
**CartDrawer:** Overlay separado del drawer en dos motion.div diferentes

## Hipótesis de Causas Posibles

### Hipótesis 1: Race Conditions en Timeouts
Los timeouts de 100ms y 200ms pueden causar condiciones de carrera en dispositivos móviles más lentos, donde:
- El focus no se establece correctamente antes de que el usuario intente hacer clic
- Las animaciones de motion pueden no haber completado cuando el focus se intenta establecer
- El estado del componente puede estar en transición cuando el usuario interactúa

### Hipótesis 2: Conflictos de Eventos con stopPropagation
El `stopPropagation` en el div de la imagen puede interferir con la propagación de eventos de clic en dispositivos táctiles, donde:
- Los eventos touch y click pueden comportarse diferente
- El stopPropagation puede bloquear eventos necesarios para el cierre
- La detección de tap vs click puede verse afectada

### Hipótesis 3: Múltiples onClick Handlers
Tener onClick tanto en el overlay como en el botón de cerrar puede causar:
- Conflictos en la burbuja de eventos
- Doble ejecución del cierre en ciertas condiciones
- Comportamiento inconsistente entre diferentes tipos de input

### Hipótesis 4: Trampa de Foco Demasiado Restrictiva
El querySelector específico `'button:not([disabled]), [tabindex]:not([tabindex="-1"])'` puede:
- No capturar correctamente todos los elementos focusables en ciertos estados
- Interferir con el comportamiento nativo del navegador en móviles
- Causar problemas cuando el DOM está en transición durante animaciones

### Hipótesis 5: Estructura de Overlay Combinada
Tener el overlay y el contenido en el mismo motion.div puede causar:
- Problemas con la detección de eventos en diferentes zonas
- Conflictos entre las animaciones del contenedor y sus hijos
- Comportamiento inconsistente en la detección de clics en el overlay vs contenido

## Contexto Adicional

### Uso del Componente
El componente `ImageZoom` se usa en:
- `src/app/producto/[id]/page-client.tsx` (línea 60)
- Se integra dentro de un motion.div con variants de animación
- Está contenido en un grid responsive con otros elementos

### Comportamiento Esperado
1. Usuario hace clic en la imagen → se abre el zoom
2. Aparece el overlay con botón X en la esquina superior derecha
3. Usuario hace clic en X → se cierra el zoom inmediatamente
4. El focus debería volver al botón trigger original

### Comportamiento Actual Problemático
1. Usuario hace clic en la imagen → se abre el zoom ✅
2. Aparece el overlay con botón X ✅
3. Usuario hace clic en X → **a veces no responde** ❌
4. En móviles parece no funcionar consistentemente ❌

### Pruebas Realizadas
- En vista móvil del navegador: funciona "de vez en cuando"
- Grabando pantalla desde teléfono: el botón parece no funcionar
- En desktop: aparentemente funciona bien (no se reportaron problemas desktop)

## Datos para Debugging

### Variables de Estado Relevantes
```typescript
const [isZoomed, setIsZoomed] = useState(false)
const closeButtonRef = useRef<HTMLButtonElement>(null)
const triggerButtonRef = useRef<HTMLButtonElement>(null)
const dialogRef = useRef<HTMLDivElement>(null)
```

### Event Listeners Activos
1. `keydown` para Escape key
2. `keydown` para Tab (trampa de foco)
3. `onClick` en overlay
4. `onClick` en botón de cerrar
5. `onClick` en div de imagen (con stopPropagation)

### Animaciones Activas
1. Overlay: opacity 0 → 1 → 0
2. Botón cerrar: scale 0.8 → 1 → 0.8, opacity 0 → 1 → 0
3. Imagen: scale 0.8 → 1 → 0.8, opacity 0 → 1 → 0
4. Spring transitions con stiffness: 300, damping: 25

## Recomendaciones para Investigación

1. **Eliminar timeouts primero:** Remover los timeouts de focus management y probar si el problema persiste
2. **Separar overlay y contenido:** Reestructurar como Modal y CartDrawer con overlays separados
3. **Simplificar trampa de foco:** Usar el mismo enfoque que CartDrawer
4. **Eliminar stopPropagation:** Probar sin el stopPropagation en la imagen
5. **Consolidar onClick handlers:** Tener un solo punto de cierre como en los componentes funcionales

## Archivos Relacionados

- `src/components/catalog/image-zoom.tsx` (componente problemático)
- `src/components/ui/modal.tsx` (referencia funcional)
- `src/components/cart/cart-drawer.tsx` (referencia funcional)
- `src/app/producto/[id]/page-client.tsx` (uso del componente)

## Información de Entorno

- Framework: Next.js 16, React 19
- Librería de animación: motion/react
- Dispositivos afectados: Principalmente móviles
- Navegadores afectados: No especificado, pero reportado en vista móvil de navegador

---

**Nota para Kimi:** Este reporte contiene todo el contexto disponible sobre el problema. Los componentes Modal y CartDrawer funcionan perfectamente en las mismas condiciones, lo que sugiere que el problema es específico de la implementación de ImageZoom, no del entorno o navegador.