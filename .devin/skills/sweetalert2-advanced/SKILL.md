---
name: sweetalert2-advanced
description: Dominio de características avanzadas de SweetAlert2 - toasts, customización, validación, async, timers, animaciones. Usa esta skill cuando el usuario necesite implementar toasts/notificaciones, customizar la apariencia de alertas, agregar validación de inputs, manejar operaciones asíncronas en alertas, o usar features avanzadas de SweetAlert2. También actívala cuando el usuario mencione toast, notificaciones, validación, async en alertas, o customización de modales. NOTA: Para usar en React, consulta la skill sweetalert2-react.
---

# SweetAlert2 Avanzado

Esta skill cubre características avanzadas de SweetAlert2 más allá de las alertas básicas.

## Toasts (Notificaciones)

### Toast Básico

```typescript
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

Toast.fire({
  icon: "success",
  title: "Guardado correctamente",
});
```

### Toast Simple

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
  title: "¡Acción completada!",
});
```

### Posiciones de Toast

- `'top'` - Arriba centrado
- `'top-start'` - Arriba izquierda
- `'top-end'` - Arriba derecha
- `'center'` - Centrado
- `'center-start'` - Centro izquierda
- `'center-end'` - Centro derecha
- `'bottom'` - Abajo centrado
- `'bottom-start'` - Abajo izquierda
- `'bottom-end'` - Abajo derecha

### Toast con Loading

```typescript
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
});

Toast.fire({
  title: "Procesando...",
  didOpen: () => {
    Swal.showLoading();
  },
});

// Luego, cuando termine:
Toast.fire({
  icon: "success",
  title: "¡Completado!",
  timer: 2000,
});
```

## Inputs y Validación

### Input de Texto

```typescript
Swal.fire({
  title: "Ingresa tu nombre",
  input: "text",
  inputLabel: "Nombre",
  inputPlaceholder: "Tu nombre",
  showCancelButton: true,
  confirmButtonText: "Guardar",
  cancelButtonText: "Cancelar",
  inputValidator: (value) => {
    if (!value) {
      return "¡Debes ingresar un nombre!";
    }
  },
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire("¡Guardado!", `Tu nombre es: ${result.value}`, "success");
  }
});
```

### Input de Email

```typescript
Swal.fire({
  title: "Ingresa tu email",
  input: "email",
  inputLabel: "Email",
  inputPlaceholder: "ejemplo@correo.com",
  inputValidator: (value) => {
    if (!value) {
      return "¡Debes ingresar un email!";
    }
    if (!value.includes("@")) {
      return "¡Email inválido!";
    }
  },
});
```

### Input de Contraseña

```typescript
Swal.fire({
  title: "Ingresa tu contraseña",
  input: "password",
  inputLabel: "Contraseña",
  inputPlaceholder: "••••••••",
  inputValidator: (value) => {
    if (!value || value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
  },
});
```

### Input de Select (Dropdown)

```typescript
Swal.fire({
  title: "Selecciona una opción",
  input: "select",
  inputOptions: {
    option1: "Opción 1",
    option2: "Opción 2",
    option3: "Opción 3",
  },
  inputPlaceholder: "Selecciona...",
  showCancelButton: true,
  inputValidator: (value) => {
    if (!value) {
      return "¡Debes seleccionar una opción!";
    }
  },
});
```

### Input de Checkbox

```typescript
Swal.fire({
  title: "Términos y condiciones",
  input: "checkbox",
  inputValue: 0,
  inputPlaceholder: "Acepto los términos y condiciones",
  confirmButtonText: "Continuar",
  inputValidator: (result) => {
    if (!result) {
      return "¡Debes aceptar los términos para continuar!";
    }
  },
});
```

### Validación Asíncrona

```typescript
Swal.fire({
  title: "Nombre de usuario",
  input: "text",
  inputValidator: async (value) => {
    if (!value) {
      return "¡El nombre es requerido!";
    }
    // Validación asíncrona (ej: verificar si existe en BD)
    const exists = await checkUsernameExists(value);
    if (exists) {
      return "Este nombre de usuario ya está en uso";
    }
  },
});
```

## Operaciones Asíncronas

### Loading State

```typescript
Swal.fire({
  title: "Cargando...",
  didOpen: () => {
    Swal.showLoading();
  },
});

// Tu operación asíncrona
await fetchData();

// Actualizar con resultado
Swal.fire({
  icon: "success",
  title: "¡Completado!",
  text: "Los datos se cargaron correctamente.",
});
```

### Alerta con Async/Await

```typescript
const handleSubmit = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Formulario",
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="Nombre">
      <input id="swal-input2" class="swal2-input" placeholder="Email">
    `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        (document.getElementById("swal-input1") as HTMLInputElement).value,
        (document.getElementById("swal-input2") as HTMLInputElement).value,
      ];
    },
  });

  if (formValues) {
    Swal.fire(JSON.stringify(formValues));
  }
};
```

### Async en preConfirm

```typescript
Swal.fire({
  title: "Subir archivo",
  input: "file",
  inputAttributes: {
    accept: "image/*",
  },
  preConfirm: async (file) => {
    if (!file) {
      Swal.showValidationMessage("¡Debes seleccionar un archivo!");
      return false;
    }

    try {
      const uploaded = await uploadFile(file);
      return uploaded;
    } catch (error) {
      Swal.showValidationMessage("Error al subir el archivo");
      return false;
    }
  },
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire("¡Subido!", "El archivo se subió correctamente.", "success");
  }
});
```

## Customización de Apariencia

### Custom CSS

```typescript
Swal.fire({
  title: "Alerta Customizada",
  customClass: {
    container: "my-swal-container",
    popup: "my-swal-popup",
    header: "my-swal-header",
    title: "my-swal-title",
    closeButton: "my-swal-close-button",
    icon: "my-swal-icon",
    image: "my-swal-image",
    content: "my-swal-content",
    input: "my-swal-input",
    actions: "my-swal-actions",
    confirmButton: "my-swal-confirm-button",
    cancelButton: "my-swal-cancel-button",
    denyButton: "my-swal-deny-button",
    footer: "my-swal-footer",
  },
});
```

### Custom Width y Padding

```typescript
Swal.fire({
  title: "Alerta Grande",
  width: "600px",
  padding: "3em",
  background: "#fff url(/images/trees.png)",
  backdrop: `
    rgba(0,0,123,0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat
  `,
});
```

### Sin Animación

```typescript
Swal.fire({
  title: "Sin animación",
  animation: false,
});
```

### Custom Timer

```typescript
Swal.fire({
  title: "Auto-cierre en 3 segundos",
  timer: 3000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading();
  },
});
```

## Múltiples Alertas en Secuencia

```typescript
const steps = ["1", "2", "3"];
const Queue = Swal.mixin({
  progressSteps: steps,
  confirmButtonText: "Siguiente >",
  currentProgressStep: 0,
});

await Queue.fire({
  title: "Paso 1",
  text: "Primera pregunta",
});

Queue.currentProgressStep = 1;
await Queue.fire({
  title: "Paso 2",
  text: "Segunda pregunta",
});

Queue.currentProgressStep = 2;
await Queue.fire({
  title: "Paso 3",
  text: "Tercera pregunta",
  confirmButtonText: "Finalizar",
});
```

## Footer

```typescript
Swal.fire({
  icon: "info",
  title: "Información",
  text: "Texto principal de la alerta.",
  footer: '<a href="#">Más información</a>',
});
```

## Image

```typescript
Swal.fire({
  title: "Imagen",
  imageUrl: "https://placeholder.com/150",
  imageWidth: 150,
  imageHeight: 150,
  imageAlt: "Imagen de ejemplo",
});
```

## Global Defaults

```typescript
// Configurar defaults globales
Swal.defaults({
  buttonsStyling: false,
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-danger",
  },
});

// Resetear defaults
Swal.resetDefaults();
```

## Métodos Útiles

```typescript
// Cerrar alerta manualmente
Swal.close();

// Actualizar contenido dinámicamente
Swal.update({
  title: "Nuevo título",
  text: "Nuevo texto",
});

// Mostrar loading
Swal.showLoading();

// Ocultar loading
Swal.hideLoading();

// Habilitar/deshabilitar botones
Swal.getConfirmButton()?.disabled = true;
Swal.getCancelButton()?.disabled = false;

// Obtener input
const input = Swal.getInput();

// Validar input manualmente
Swal.showValidationMessage("Mensaje de validación");
```

## Eventos

```typescript
Swal.fire({
  title: "Eventos",
  didOpen: () => {
    console.log("Alerta abierta");
  },
  willClose: () => {
    console.log("Alerta se cerrará");
  },
  didClose: () => {
    console.log("Alerta cerrada");
  },
});
```

## Mejores Prácticas

1. **Para operaciones largas**, usa `Swal.showLoading()` para dar feedback visual.
2. **Para notificaciones cortas**, usa toasts en lugar de alertas modales.
3. **Para validación compleja**, usa `inputValidator` asíncrono.
4. **Para secuencias de pasos**, usa `progressSteps` para mostrar progreso.
5. **Customiza CSS** para mantener consistencia con tu marca.

## Referencias

- Documentación oficial: https://sweetalert2.github.io/
- Recipe Gallery: https://sweetalert2.github.io/recipe-gallery/
