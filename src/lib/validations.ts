// Constantes de validación para productos y archivos

export const FILE_VALIDATIONS = {
  // Límite de 5MB para reducir costos de storage
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  // Extensiones de imagen permitidas (solo jpg, jpeg, png, webp)
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'] as readonly string[],
  // MIME types permitidos (validación)
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ] as readonly string[],
  // MIME types estándar para el atributo accept del input
  ACCEPT_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ] as readonly string[],
} as const

export const PRODUCT_VALIDATIONS = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  DESCRIPTION: {
    MAX_LENGTH: 2000,
  },
  CATEGORY: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  PRICE: {
    MIN: 0.01,
    MAX: 999999.99,
    DECIMAL_PLACES: 2,
  },
} as const

export const ERROR_MESSAGES = {
  // Errores de archivo
  FILE_NO_SELECTED: 'No se seleccionó archivo',
  FILE_TOO_LARGE: `El archivo supera el límite de ${FILE_VALIDATIONS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
  FILE_INVALID_TYPE: 'Solo se permiten imágenes (JPG, PNG, WebP)',
  FILE_INVALID_EXTENSION: 'Formato de archivo no soportado',
  
  // Errores de producto
  NAME_REQUIRED: 'El nombre es requerido',
  NAME_TOO_LONG: `El nombre no puede exceder ${PRODUCT_VALIDATIONS.NAME.MAX_LENGTH} caracteres`,
  NAME_TOO_SHORT: `El nombre debe tener al menos ${PRODUCT_VALIDATIONS.NAME.MIN_LENGTH} caracteres`,
  DESCRIPTION_TOO_LONG: `La descripción no puede exceder ${PRODUCT_VALIDATIONS.DESCRIPTION.MAX_LENGTH} caracteres`,
  CATEGORY_REQUIRED: 'La categoría es requerida',
  CATEGORY_TOO_LONG: `La categoría no puede exceder ${PRODUCT_VALIDATIONS.CATEGORY.MAX_LENGTH} caracteres`,
  PRICE_INVALID: 'El precio debe ser un número válido',
  PRICE_TOO_LOW: `El precio debe ser mayor a ${PRODUCT_VALIDATIONS.PRICE.MIN}`,
  PRICE_TOO_HIGH: `El precio no puede exceder ${PRODUCT_VALIDATIONS.PRICE.MAX}`,
  PRICE_INVALID_DECIMALS: `El precio puede tener máximo ${PRODUCT_VALIDATIONS.PRICE.DECIMAL_PLACES} decimales`,
  
  // Errores generales
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.',
  TIMEOUT_ERROR: 'La operación tardó demasiado. Por favor, intenta nuevamente.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
  SUCCESS_CREATE: 'Producto creado exitosamente',
  SUCCESS_UPDATE: 'Producto actualizado exitosamente',
} as const

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export function validateProductName(name: unknown): string | null {
  const value = typeof name === "string" ? name.trim() : "";
  if (!value) return ERROR_MESSAGES.NAME_REQUIRED;
  if (value.length < PRODUCT_VALIDATIONS.NAME.MIN_LENGTH)
    return ERROR_MESSAGES.NAME_TOO_SHORT;
  if (value.length > PRODUCT_VALIDATIONS.NAME.MAX_LENGTH)
    return ERROR_MESSAGES.NAME_TOO_LONG;
  return null;
}

export function validateProductDescription(
  description: unknown,
): string | null {
  const value = typeof description === "string" ? description.trim() : "";
  if (value.length > PRODUCT_VALIDATIONS.DESCRIPTION.MAX_LENGTH)
    return ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
  return null;
}

export function validateCategoryName(category: unknown): string | null {
  const value = typeof category === "string" ? category.trim() : "";
  if (!value) return ERROR_MESSAGES.CATEGORY_REQUIRED;
  if (value.length > PRODUCT_VALIDATIONS.CATEGORY.MAX_LENGTH)
    return ERROR_MESSAGES.CATEGORY_TOO_LONG;
  return null;
}

export function validateProductPrice(
  value: unknown,
  label: string,
): string | null {
  // 1. Validar null/undefined
  if (value === null || value === undefined) {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID}`;
  }

  // 2. Validar string vacío (antes de convertir)
  if (value === '' || (typeof value === 'string' && value.trim() === '')) {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID}`;
  }

  // 3. Rechazar booleanos explícitamente
  if (typeof value === 'boolean') {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID}`;
  }

  // 4. Si es string, validar formato ANTES de convertir
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    // Rechazar notación científica
    if (/[eE]/.test(trimmed)) {
      return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID}`;
    }
    
    // Validar formato decimal estricto
    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID_DECIMALS}`;
    }
  }

  // 5. Convertir a número
  const price = typeof value === "number" ? value : Number(value);

  // 6. Validar NaN
  if (Number.isNaN(price)) {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID}`;
  }

  // 7. Validar rango
  if (price < PRODUCT_VALIDATIONS.PRICE.MIN) {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_TOO_LOW}`;
  }

  if (price > PRODUCT_VALIDATIONS.PRICE.MAX) {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_TOO_HIGH}`;
  }

  // 8. Validar decimales en el número (no en el string)
  const cents = Math.round(price * 100);
  if (Math.abs(price * 100 - cents) > 0.001) {
    return `Precio ${label}: ${ERROR_MESSAGES.PRICE_INVALID_DECIMALS}`;
  }

  return null;
}

export function validateProductInStock(
  value: unknown,
  required: boolean,
): string | null {
  if (value === undefined) {
    if (required) return "El campo de disponibilidad es requerido";
    return null;
  }
  if (typeof value !== "boolean")
    return "El campo de disponibilidad debe ser verdadero o falso";
  return null;
}

export function validateProductPayload(
  payload: {
    name?: unknown;
    description?: unknown | null;
    price_usd?: unknown;
    category?: unknown;
    in_stock?: unknown;
  },
  required: boolean = true,
): string | null {
  const name = payload.name;
  const category = payload.category;
  const priceUsd = payload.price_usd;
  const description = payload.description;
  const inStock = payload.in_stock;

  if (required || name !== undefined) {
    const nameError = validateProductName(name);
    if (nameError) return nameError;
  }

  if (description !== undefined) {
    const descriptionError = validateProductDescription(description);
    if (descriptionError) return descriptionError;
  }

  if (required || category !== undefined) {
    const categoryError = validateCategoryName(category);
    if (categoryError) return categoryError;
  }

  if (required || priceUsd !== undefined) {
    const usdError = validateProductPrice(priceUsd, "USD");
    if (usdError) return usdError;
  }

  // in_stock es opcional, default true en el schema
  if (inStock !== undefined && typeof inStock !== "boolean") {
    return "El campo de disponibilidad debe ser verdadero o falso";
  }

  return null;
}

export function validateFile(file: File): string | null {
  if (file.size > FILE_VALIDATIONS.MAX_FILE_SIZE) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  if (!FILE_VALIDATIONS.ALLOWED_MIME_TYPES.includes(file.type)) {
    return ERROR_MESSAGES.FILE_INVALID_TYPE;
  }

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !FILE_VALIDATIONS.ALLOWED_EXTENSIONS.includes(ext)) {
    return ERROR_MESSAGES.FILE_INVALID_EXTENSION;
  }

  return null;
}
