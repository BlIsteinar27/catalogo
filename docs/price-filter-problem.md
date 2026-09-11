# Problema del Filtro de Rango de Precios - Contexto Completo

## Información del Proyecto

- **Nombre del proyecto**: Demo Catálogo
- **Stack**: Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS, Motion
- **Ubicación**: `F:\dev\work\clients\demo-catalogo`
- **Servidor de desarrollo**: http://localhost:3000

## Descripción del Problema

El filtro de rango de precios en la página principal del catálogo tiene problemas de usabilidad y lógica que impiden que los usuarios puedan establecer rangos de precios de manera natural e intuitiva.

### Archivos Involucrados

1. **Componente del filtro**: `src/components/catalog/price-filter.tsx`
2. **Página principal**: `src/app/page-client.tsx`
3. **Utilidad de precios**: `src/lib/utils.ts` (función `formatPrice`)

### Componente Principal: PriceFilter

**Ubicación**: `src/components/catalog/price-filter.tsx`

**Props del componente**:
```typescript
interface PriceFilterProps {
  minPrice: number      // Precio mínimo del catálogo actual
  maxPrice: number      // Precio máximo del catálogo actual
  value: [number, number] | null  // Rango seleccionado o null si no hay filtro
  onChange: (value: [number, number] | null) => void
  labels?: {
    min?: string
    max?: string
    range?: string
    reset?: string
  }
}
```

**Estado actual del componente**:
- `localMin = value?.[0] ?? ''` - Muestra el valor mínimo seleccionado o string vacío
- `localMax = value?.[1] ?? ''` - Muestra el valor máximo seleccionado o string vacío

### Handlers Actuales

```typescript
const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value
  if (inputValue === '') {
    onChange(null)
    return
  }
  const newValue = Number(inputValue)
  if (Number.isNaN(newValue)) return
  const currentMax = value?.[1] ?? Infinity
  onChange([newValue, currentMax])
}

const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value
  if (inputValue === '') {
    onChange(null)
    return
  }
  const newValue = Number(inputValue)
  if (Number.isNaN(newValue)) return
  const currentMin = value?.[0] ?? 0
  onChange([currentMin, newValue])
}
```

### Lógica de Filtrado en page-client.tsx

**Ubicación**: `src/app/page-client.tsx` (líneas 63-68)

```typescript
if (priceFilter) {
  result = result.filter((p) => {
    const price = formatPrice(p);
    return price >= priceFilter[0] && price <= priceFilter[1];
  });
}
```

## Problemas Identificados

### 1. Validación Restrictiva Basada en Precios del Catálogo

**Problema**: El componente original usaba `minPrice` y `maxPrice` (precios extremos del catálogo actual) para hacer clamping de los valores que el usuario escribía.

**Comportamiento incorrecto**:
- Si el usuario escribe "5" en el mínimo pero el producto más barato es 2.5, lo forzaba a 2.5
- Si el usuario escribe "100" en el máximo pero el producto más caro es 89.99, lo forzaba a 89.99

**Código problemático original**:
```typescript
const clamped = Math.min(Math.max(newValue, minPrice), maxPrice)
```

### 2. Validación Intrusiva en onBlur

**Problema**: Se implementaron handlers `onBlur` que corregían automáticamente los valores cuando el usuario cambiaba de un input a otro.

**Comportamiento frustrante**: Cuando el usuario escribía un valor y luego cambiaba al otro input, el valor se corregía automáticamente sin consentimiento del usuario.

### 3. Valores por Defecto Incoherentes

**Problema**: Cuando se vaciaba un input, se forzaban valores por defecto basados en los precios del catálogo.

**Intentos de solución**:
- Usar `Infinity` para el máximo cuando no existe
- Usar `0` para el mínimo cuando no existe
- Esto sigue siendo problemático porque no es natural para el usuario

## Intentos de Solución Realizados

### Intento 1: Cambiar type="number" a type="text"
- **Objetivo**: Permitir entrada libre de texto
- **Resultado**: Parcialmente funcionó, pero persistieron otros problemas

### Intento 2: Eliminar clamping basado en precios del catálogo
- **Objetivo**: Permitir cualquier valor numérico
- **Resultado**: Mejoró, pero surgieron otros problemas

### Intento 3: Agregar validación en onBlur
- **Objetivo**: Validar al perder el foco
- **Resultado**: Creó validación intrusiva frustrante

### Intento 4: Eliminar onBlur y usar valores por defecto diferentes
- **Objetivo**: Simplificar la lógica
- **Resultado**: Sigue siendo problemático con `Infinity` y `0`

## Comportamiento Esperado (Requisitos del Usuario)

### 1. Edición Completamente Libre
- El usuario debe poder escribir cualquier valor numérico sin restricciones
- No debe haber correcciones automáticas de lo que el usuario escribe
- Los valores pueden estar fuera del rango de productos actuales

### 2. Sin Validación Intrusiva
- No debe haber handlers `onBlur` que corrijan valores automáticamente
- El usuario debe poder cambiar entre inputs sin que sus valores sean modificados

### 3. Comportamiento Natural al Vaciar
- Cuando el usuario borra el contenido de un input, el filtro debería desactivarse
- No debe forzarse valores por defecto basados en el catálogo

### 4. Rango de Precios Lógico
- Ejemplo: Si el usuario quiere ver productos de 5-10 USD, debe poder hacerlo
- Ejemplo: Si escribe 1 USD mínimo pero no hay productos de 1 USD (sí de 2 USD), debería mostrar productos desde 2 USD
- Ejemplo: Si escribe 1000 USD máximo pero el producto más caro es 89 USD, debería mostrar todos los productos (están dentro del rango)

### 5. Filtrado Pasivo
- El filtro simplemente busca productos en el rango especificado
- Si no hay productos en ese rango, no muestra resultados (comportamiento natural)
- La validación debe ocurrir solo a nivel de filtrado, no a nivel de input

## Visual Track (Barra de Progreso)

El componente tiene una barra visual que muestra el rango seleccionado:

```typescript
const clampPercent = (n: number) => Math.min(100, Math.max(0, n))
const effectiveMin = typeof localMin === 'number' ? localMin : minPrice
const effectiveMax = typeof localMax === 'number' ? localMax : maxPrice
const trackLeft =
  maxPrice > minPrice ? clampPercent(((effectiveMin - minPrice) / (maxPrice - minPrice)) * 100) : 0
const trackRight =
  maxPrice > minPrice ? clampPercent(100 - ((effectiveMax - minPrice) / (maxPrice - minPrice)) * 100) : 0
```

**Problema**: Esta lógica de clamp también está basada en `minPrice` y `maxPrice` del catálogo, lo que puede causar problemas visuales cuando el usuario escribe valores fuera de ese rango.

## Requisitos Específicos para la Solución

1. **Eliminar dependencia de minPrice/maxPrice para validación de input**
2. **Permitir cualquier valor numérico válido en los inputs**
3. **No corregir automáticamente lo que el usuario escribe**
4. **Mantener la funcionalidad de visual track pero adaptarla a valores fuera de rango**
5. **Comportamiento intuitivo y natural desde la perspectiva del usuario**
6. **No dejar "root causes" o referencias a funciones eliminadas**

## Contexto de Uso

El componente se usa en la página principal del catálogo:

```typescript
<PriceFilter
  minPrice={priceRange[0]}  // Calculado desde productos actuales
  maxPrice={priceRange[1]}  // Calculado desde productos actuales
  value={priceFilter}
  onChange={setPriceFilter}
/>
```

Donde `priceRange` se calcula así:
```typescript
const priceRange = useMemo(() => {
  if (products.length === 0) return [0, 0] as [number, number];
  const prices = products.map((p) => formatPrice(p));
  return [Math.min(...prices), Math.max(...prices)] as [number, number];
}, [products]);
```

## Estado Actual del Código

El código actual en `src/components/catalog/price-filter.tsx` tiene:
- Inputs con `type="text"`
- Handlers `onChange` que usan `Infinity` y `0` como valores por defecto
- Sin handlers `onBlur`
- Lógica de track que todavía usa `minPrice` y `maxPrice` para clamping visual

## Solicitud Específica

Por favor, proporciona una implementación completa y funcional del componente `PriceFilter` que:

1. Resuelva todos los problemas mencionados
2. Tenga un comportamiento lógico e intuitivo
3. No deje errores ni referencias a funciones inexistentes
4. Sea coherente con el comportamiento esperado de un filtro de precios en e-commerce
5. Incluya cualquier mejora necesaria en la lógica del track visual

El objetivo es que el usuario pueda establecer rangos de precios de manera natural sin frustraciones ni comportamientos inesperados.