---
name: sweetalert2-react
description: Dominio de integración de SweetAlert2 con React. Usa esta skill cuando el usuario necesite integrar SweetAlert2 en componentes React, manejar estado de React con SweetAlert2, o trabajar con alertas en aplicaciones React/Next.js. También actívala cuando el usuario mencione React + SweetAlert, alertas en componentes React, o integración de SweetAlert en React.
---

# SweetAlert2 con React

SweetAlert2 funciona perfectamente con React sin necesidad de dependencias adicionales. Puedes usarlo directamente en tus componentes de React.

## Instalación

El proyecto ya tiene SweetAlert2 instalado (v11.26.25). No se requiere ninguna dependencia adicional.

## Configuración Básica

```typescript
import Swal from "sweetalert2";
```

## Integración con HTML en Alertas

### HTML en Contenido

```typescript
Swal.fire({
  title: "Detalles del producto",
  html: `
    <div>
      <p>Nombre: <strong>Producto Awesome</strong></p>
      <p>Precio: <span class="text-green-600">$99.99</span></p>
      <p>Stock: <span class="text-blue-600">10 unidades</span></p>
    </div>
  `,
  icon: "info",
});
```

## Patrón en Componentes React

### Componente con Server Actions (usando el helper del proyecto)

```typescript
'use client'

import { useState } from 'react'
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'

export default function DeleteButton({ itemId }: { itemId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = await showActionConfirm(
      '¿Eliminar elemento?',
      'Esta acción no se puede deshacer.',
      'Sí, eliminar'
    )

    if (confirmed) {
      setIsDeleting(true)

      try {
        await deleteItem(itemId)
        showSuccess('¡Eliminado!', 'El elemento ha sido eliminado correctamente.')
      } catch (error) {
        showError('Error', error instanceof Error ? error.message : 'No se pudo eliminar el elemento.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
```

### Componente con Server Actions (usando Swal directamente)

```typescript
'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'

export default function DeleteButton({ itemId }: { itemId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar elemento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      setIsDeleting(true)

      try {
        await deleteItem(itemId)

        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El elemento ha sido eliminado correctamente.',
          confirmButtonText: 'OK'
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error instanceof Error ? error.message : 'No se pudo eliminar el elemento.',
          confirmButtonText: 'Entendido'
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
```

### Hook Personalizado para Alertas (usando el helper del proyecto)

```typescript
// hooks/useAlert.ts
import {
  showSuccess,
  showError,
  showConfirm,
  showWarning,
  showInfo,
  showLoading,
  closeAlert,
} from "@/lib/alerts";

export const useAlert = () => {
  return {
    showSuccess,
    showError,
    showConfirm,
    showWarning,
    showInfo,
    showLoading,
    close: closeAlert,
  };
};
```

### Usando el Hook

```typescript
'use client'

import { useAlert } from '@/hooks/useAlert'

export default function MyComponent() {
  const { showSuccess, showError, showConfirm } = useAlert()

  const handleSubmit = async () => {
    try {
      await myAction()
      showSuccess('¡Éxito!', 'La operación se completó.')
    } catch (error) {
      showError('Error', 'Algo salió mal.')
    }
  }

  const handleDelete = async () => {
    const confirmed = await showConfirm('¿Eliminar?', 'Esta acción no se puede deshacer.')
    if (confirmed) {
      // Lógica de eliminación
    }
  }

  return (
    <div>
      <button onClick={handleSubmit}>Enviar</button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  )
}
```

## Integración con Tailwind CSS

SweetAlert2 funciona perfectamente con Tailwind CSS. Puedes usar clases de Tailwind en el HTML:

```typescript
Swal.fire({
  title: "¡Bienvenido!",
  html: `
    <div class="text-center">
      <h3 class="text-xl font-bold text-gray-900">¡Bienvenido!</h3>
      <p class="text-gray-600 mt-2">Tu cuenta ha sido creada exitosamente.</p>
    </div>
  `,
  icon: "success",
  confirmButtonText: "Continuar",
});
```

## Tablas en Alertas

```typescript
Swal.fire({
  title: "Lista de productos",
  html: `
    <table class="w-full text-left">
      <thead>
        <tr class="border-b">
          <th class="py-2">Nombre</th>
          <th class="py-2">Precio</th>
          <th class="py-2">Stock</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product) => `
          <tr class="border-b">
            <td class="py-2">${product.name}</td>
            <td class="py-2">$${product.price}</td>
            <td class="py-2">${product.stock}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `,
  width: "700px",
});
```

## Toast

```typescript
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

Toast.fire({
  icon: "success",
  title: "Guardado correctamente",
});
```

## Contexto de React con SweetAlert

```typescript
// context/AlertContext.tsx
'use client'

import { createContext, useContext } from 'react'
import { showSuccess, showError, showConfirm } from '@/lib/alerts'

interface AlertContextType {
  showSuccess: (title: string, text?: string) => Promise<void>
  showError: (title: string, text?: string) => Promise<void>
  showConfirm: (title: string, text?: string) => Promise<boolean>
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  return (
    <AlertContext.Provider value={{ showSuccess, showError, showConfirm }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return context
}
```

## Server Actions con Alertas

```typescript
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  try {
    // Lógica de eliminación
    await db.product.delete({ where: { id } });
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar producto" };
  }
}
```

```typescript
// componente que usa el server action
'use client'

import { deleteProduct } from '@/app/actions'
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'

export default function ProductItem({ product }: { product: Product }) {
  const handleDelete = async () => {
    const confirmed = await showActionConfirm(
      '¿Eliminar producto?',
      `¿Estás seguro de eliminar "${product.name}"?`,
      'Sí, eliminar'
    )

    if (confirmed) {
      const response = await deleteProduct(product.id)

      if (response.success) {
        showSuccess('¡Eliminado!', 'El producto ha sido eliminado.')
      } else {
        showError('Error', response.error)
      }
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <span>{product.name}</span>
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        Eliminar
      </button>
    </div>
  )
}
```

## Loading States en React

```typescript
'use client'

import { useState } from 'react'
import { showLoading, closeAlert } from '@/lib/alerts'

export default function MyComponent() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const loadingAlert = showLoading('Procesando...')
    setLoading(true)

    try {
      await myAsyncOperation()
      closeAlert()
      // Mostrar alerta de éxito
    } catch (error) {
      closeAlert()
      // Mostrar alerta de error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Procesando...' : 'Enviar'}
    </button>
  )
}
```

## Mejores Prácticas

1. **Usa el helper del proyecto** - El proyecto tiene un helper en `src/lib/alerts.ts` con funciones predefinidas para alertas comunes.
2. **Crea hooks personalizados** para encapsular la lógica de alertas comunes usando el helper.
3. **Usa Context API** si necesitas alertas en múltiples componentes.
4. **Integra con Tailwind** para mantener consistencia visual con tu app usando clases en HTML.
5. **Maneja el estado de React** apropiadamente (loading, disabled states).
6. **Combina con Server Actions** para operaciones que requieren confirmación.
7. **Considera accesibilidad** - SweetAlert2 es accesible por defecto, pero asegúrate de usar texto descriptivo.

## Referencias

- SweetAlert2 docs: https://sweetalert2.github.io/
- React 19 docs: https://react.dev/
- Helper del proyecto: src/lib/alerts.ts
- Skills relacionadas: sweetalert2-basics, sweetalert2-advanced
