import Swal from 'sweetalert2'

/**
 * Alertas de confirmación, error y confirmación de acción usando SweetAlert2
 */

/**
 * Muestra una alerta de confirmación básica
 * @param title - Título de la alerta
 * @param text - Texto descriptivo (opcional)
 * @returns Promise que resuelve con true si el usuario confirma
 */
export const showConfirm = async (title: string, text?: string): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  })
  return result.isConfirmed
}

/**
 * Muestra una alerta de error
 * @param title - Título del error
 * @param text - Mensaje de error (opcional)
 * @returns Promise que se resuelve cuando el usuario cierra la alerta
 */
export const showError = async (title: string, text?: string): Promise<void> => {
  await Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#3085d6'
  })
}

/**
 * Muestra una alerta de confirmación de acción (pregunta antes de proceder)
 * Útil para acciones destructivas o importantes
 * @param title - Título de la confirmación
 * @param text - Texto que describe la acción y sus consecuencias
 * @param confirmText - Texto personalizado para el botón de confirmación (opcional)
 * @param confirmColor - Color del botón de confirmación (opcional, por defecto rojo para acciones destructivas)
 * @returns Promise que resuelve con true si el usuario confirma la acción
 */
export const showActionConfirm = async (
  title: string,
  text: string,
  confirmText: string = 'Sí, proceder',
  confirmColor: string = '#d33'
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#3085d6',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    }
  })
  return result.isConfirmed
}

/**
 * Muestra una alerta de éxito
 * @param title - Título del mensaje de éxito
 * @param text - Texto descriptivo (opcional)
 * @returns Promise que se resuelve cuando el usuario cierra la alerta
 */
export const showSuccess = async (title: string, text?: string): Promise<void> => {
  await Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  })
}

/**
 * Muestra una alerta de información
 * @param title - Título del mensaje informativo
 * @param text - Texto descriptivo (opcional)
 * @returns Promise que se resuelve cuando el usuario cierra la alerta
 */
export const showInfo = async (title: string, text?: string): Promise<void> => {
  await Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  })
}

/**
 * Muestra una alerta de advertencia
 * @param title - Título de la advertencia
 * @param text - Texto descriptivo (opcional)
 * @returns Promise que se resuelve cuando el usuario cierra la alerta
 */
export const showWarning = async (title: string, text?: string): Promise<void> => {
  await Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#f59e0b'
  })
}

/**
 * Muestra una alerta de carga
 * @param title - Título de la alerta de carga (por defecto "Procesando...")
 * @returns Objeto con método close para cerrar la alerta manualmente
 */
export const showLoading = (title: string = 'Procesando...') => {
  Swal.fire({
    title,
    didOpen: () => {
      Swal.showLoading()
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false
  })

  return {
    close: () => Swal.close()
  }
}

/**
 * Cierra cualquier alerta activa
 */
export const closeAlert = (): void => {
  Swal.close()
}