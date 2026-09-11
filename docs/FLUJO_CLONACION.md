# Flujo de Clonación por Cliente

> Documento interno para TI/Agencia — NO compartir con clientes

## Pre-requisitos

- [ ] Tener acceso a GitHub (cuenta personal u organizacional)
- [ ] Tener acceso a Vercel (cuenta personal u equipo)
- [ ] Tener acceso a Supabase (cuenta personal u organizacional)
- [ ] Tener el template actualizado en tu repo privado
- [ ] Verificar que `docs/sql/setup.sql` esté actualizado

## Pasos de Clonación

### 1. GitHub: Crear repositorio para el cliente

1. Crear nuevo repositorio **privado** en GitHub
2. Nombre sugerido: `catalogo-[nombre-cliente]`
3. Clonar el template localmente
4. Copiar todos los archivos del template al nuevo repo (EXCEPTO `.env`)
5. Subir al nuevo repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from template"
   git remote add origin https://github.com/tu-org/catalogo-cliente.git
   git push -u origin main
   ```

### 2. Supabase: Crear proyecto y ejecutar setup

1. Crear nuevo proyecto en Supabase
2. Esperar a que el proyecto esté ready (2-3 minutos)
3. Ir a SQL Editor
4. Copiar contenido de `docs/sql/setup.sql`
5. Ejecutar el script
6. Verificar que:
   - Tabla `products` existe
   - Tabla `categories` existe con fila "General"
   - Bucket `product-images` existe
7. Copiar credenciales:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Vercel: Importar y configurar

1. Importar repositorio del cliente en Vercel
2. Configurar variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<url-del-paso-2>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-del-paso-2>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-del-paso-2>
   NEXT_PUBLIC_SITE_NAME=Nombre del Negocio
   NEXT_PUBLIC_SITE_DESCRIPTION=Descripción del catálogo
   NEXT_PUBLIC_WHATSAPP_NUMBER=5491112345678
   NEXT_PUBLIC_DEFAULT_CURRENCY=USD
   NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
   CRON_SECRET=<generar-con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   ```
3. Deploy
4. Verificar que el sitio cargue correctamente

### 4. Auth: Registrar usuario admin

1. Abrir URL del sitio desplegado
2. Ir a `/login`
3. Click en "Crear cuenta"
4. Ingresar email del cliente + contraseña temporal
5. Verificar que redirige al dashboard
6. Confirmar que el usuario puede crear productos

### 5. Entrega al cliente

1. Enviar email con:
   - URL pública del catálogo
   - URL del dashboard (`/dashboard`)
   - Email de admin registrado
   - Contraseña temporal (instruir cambiarla)
   - Instrucciones básicas de uso:
     - Cómo crear producto
     - Cómo subir imagen
     - Cómo editar/eliminar
2. Programar llamada de onboarding (15-30 min)

## Post-entrega

### Día 1: Verificación

- [ ] Cliente cambia contraseña de admin
- [ ] Cliente sube logo (si corresponde)
- [ ] Cliente crea 1-2 productos de prueba
- [ ] Verificar que checkout a WhatsApp funciona

### Días 2-7: Soporte

- [ ] Disponible para dudas de uso
- [ ] Corregir bugs críticos solo
- [ ] NO hacer cambios de scope sin contrato adicional

### Día 7+: Handoff completo

- [ ] Cliente es dueño del repo GitHub
- [ ] Cliente es dueño del proyecto Supabase
- [ ] Proporcionar documentación de mantenimiento básico

## Troubleshooting Común

### Error: "No autorizado" en dashboard

- Verificar que `DISABLE_AUTH_PROTECTION` no existe en env vars
- Verificar que el usuario esté autenticado
- Revisar logs de Supabase Auth

### Error: Imagen no sube

- Verificar que bucket `product-images` existe
- Verificar políticas RLS de storage
- Revisar tamaño del archivo (máx 5MB)

### Error: WhatsApp no abre

- Verificar que `NEXT_PUBLIC_WHATSAPP_NUMBER` tenga código de país
- Verificar formato sin `+` ni espacios (ej: `5491112345678`)

## Checklist de Calidad Antes de Entrega

- [ ] `npm run build` exitoso
- [ ] `setup.sql` ejecutado sin errores
- [ ] Usuario admin puede crear producto
- [ ] Imagen sube y se muestra correctamente
- [ ] Checkout a WhatsApp funciona
- [ ] Dashboard muestra resumen de productos
- [ ] No hay datos de ejemplo/mock
- [ ] Logo del cliente cargado (si corresponde)
- [ ] Dominio personalizado configurado (si corresponde)

## Tiempo Estimado

- GitHub setup: 5 min
- Supabase setup: 5 min
- Vercel deploy: 5 min
- Auth setup: 3 min
- Verificación: 5 min
- **Total: ~25 minutos por cliente**
