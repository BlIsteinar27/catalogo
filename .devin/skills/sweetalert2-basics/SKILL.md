---
name: sweetalert2-basics
description: Dominio de alertas básicas con SweetAlert2 - alertas simples, confirmación básica, error básico. Usa esta skill cuando el usuario necesite crear alertas simples, mostrar mensajes de éxito/error, implementar confirmaciones básicas, o trabajar con modales SweetAlert2. También actívala cuando el usuario mencione SweetAlert, alertas, modales, confirmaciones, o diálogos en React/TypeScript. NOTA: El proyecto tiene un helper en src/lib/alerts.ts con funciones predefinidas.
---

# SweetAlert2 Básico

SweetAlert2 es una librería para crear alertas hermosas y responsivas como reemplazo de los popups nativos de JavaScript.

## Instalación

El proyecto ya tiene SweetAlert2 instalado (v11.26.25). No se requiere ninguna dependencia adicional para el uso básico.

## Importación Básica

```typescript
import Swal from "sweetalert2";
```

## Alerta Simple

### Success (Éxito)

```typescript
Swal.fire({
  icon: "success",
  title: "¡Éxito!",
  text: "La operación se completó correctamente.",
  confirmButtonText: "OK",
});
```

### Error (Error)

```typescript
Swal.fire({
  icon: "error",
  title: "Error",
  text: "Ocurrió un error al procesar la solicitud.",
  confirmButtonText: "Entendido",
});
```

### Warning (Advertencia)

```typescript
Swal.fire({
  icon: "warning",
  title: "Advertencia",
  text: "Esta acción podría tener consecuencias.",
  confirmButtonText: "Continuar",
});
```

### Info (Información)

```typescript
Swal.fire({
  icon: "info",
  title: "Información",
  text: "Aquí tienes algunos detalles importantes.",
  confirmButtonText: "OK",
});
```

## Confirmación Básica

### Confirmación con dos botones

```typescript
Swal.fire({
  title: "¿Estás seguro?",
  text: "Esta acción no se puede deshacer.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Sí, continuar",
  cancelButtonText: "Cancelar",
}).then((result) => {
  if (result.isConfirmed) {
    // El usuario confirmó
    Swal.fire("¡Confirmado!", "La acción se ha ejecutado.", "success");
  }
});
```

### Confirmación con promesa

```typescript
const handleDelete = async () => {
  const result = await Swal.fire({
    title: "¿Eliminar este elemento?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteItem();
      Swal.fire("¡Eliminado!", "El elemento ha sido eliminado.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el elemento.", "error");
    }
  }
};
```

## Error Básico

### Mensaje de error simple

```typescript
Swal.fire({
  icon: "error",
  title: "Error",
  text: "Ocurrió un error inesperado.",
  confirmButtonText: "OK",
});
```

### Error con detalle

```typescript
Swal.fire({
  icon: "error",
  title: "Error de validación",
  html: `
    <p>Por favor revisa los siguientes campos:</p>
    <ul>
      <li>El nombre es requerido</li>
      <li>El email no es válido</li>
    </ul>
  `,
  confirmButtonText: "Corregir",
});
```

## Tipos de Iconos Disponibles

- `'success'` - Verde, checkmark
- `'error'` - Rojo, X
- `'warning'` - Amarillo, signo de exclamación
- `'info'` - Azul, signo de información
- `'question'` - Azul, signo de interrogación

## Configuración Básica de Botones

```typescript
Swal.fire({
  title: "Título",
  text: "Mensaje",
  icon: "info",
  showCancelButton: true,
  showConfirmButton: true,
  showDenyButton: false,
  confirmButtonText: "Confirmar",
  cancelButtonText: "Cancelar",
  denyButtonText: "Denegar",
  buttonsStyling: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
});
```

## Resultados de Alertas

El método `fire()` retorna una promesa con el resultado:

```typescript
const result = await MySwal.fire({
  title: "¿Confirmar?",
  showCancelButton: true,
});

// Posibles valores de result:
// result.isConfirmed - Usuario presionó el botón de confirmar
// result.isDenied - Usuario presionó el botón de denegar
// result.isDismissed - Usuario cerró la alerta o presionó cancelar
// result.value - Valor del input si existe
// result.dismiss - Cómo fue cerrada (cancel, close, backdrop, esc, timer)
```

## Mejores Prácticas

1. **Usa colores consistentes** para botones según el contexto (verde para confirmar acciones positivas, rojo para acciones destructivas).
2. **Maneja todos los estados** del resultado (isConfirmed, isDismissed).
3. **Agrega loading states** para operaciones asíncronas usando `Swal.showLoading()` y `Swal.hideLoading()`.
4. **Considera accesibilidad** - SweetAlert2 es accesible por defecto, pero asegúrate de usar texto descriptivo.
5. **Usa el helper del proyecto** - El proyecto tiene un helper en `src/lib/alerts.ts` con funciones predefinidas para alertas comunes.

## Patrón Típico en Server Actions

### Usando el helper del proyecto

```typescript
'use client'

import { useState } from 'react'
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'

export default function MyComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Tu lógica de server action aquí
      await myServerAction()

      showSuccess('¡Éxito!', 'La operación se completó correctamente.')
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Ocurrió un error inesperado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = await showActionConfirm(
      '¿Eliminar elemento?',
      'Esta acción no se puede deshacer.',
      'Sí, eliminar'
    )

    if (confirmed) {
      try {
        await deleteItem()
        showSuccess('¡Eliminado!', 'El elemento ha sido eliminado.')
      } catch (error) {
        showError('Error', 'No se pudo eliminar el elemento.')
      }
    }
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : 'Enviar'}
      </button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  )
}
```

### Usando Swal directamente

```typescript
'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'

export default function MyComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Tu lógica de server action aquí
      await myServerAction()

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'La operación se completó correctamente.',
        confirmButtonText: 'OK'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
        confirmButtonText: 'Entendido'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? 'Procesando...' : 'Enviar'}
    </button>
  )
}
```

## Referencias

- Documentación oficial: https://sweetalert2.github.io/
- GitHub: https://github.com/sweetalert2/sweetalert2
- Helper del proyecto: src/lib/alerts.ts
