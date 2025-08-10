# Panel Administrativo - SIREDU

## Descripción

El panel administrativo es un sistema completo de gestión y moderación para la plataforma SIREDU. Permite a los administradores supervisar y gestionar todo el contenido publicado por los usuarios, así como generar estadísticas e informes detallados.

## Características Principales

### 🔍 Moderación de Publicaciones
- **Revisión de contenido**: Aprobar, rechazar o marcar publicaciones para revisión
- **Filtros avanzados**: Buscar por estado, categoría, fecha y contenido
- **Notas administrativas**: Agregar comentarios y observaciones a las publicaciones
- **Gestión de estados**: Control completo sobre el ciclo de vida de las publicaciones

### 📊 Estadísticas y Métricas
- **Dashboard general**: Vista completa de usuarios, publicaciones y solicitudes
- **Análisis por categorías**: Estadísticas detalladas por tipo de producto
- **Métricas temporales**: Análisis de actividad por rangos de fechas
- **Tendencias**: Identificación de patrones y comportamientos

### 👥 Gestión de Usuarios
- **Listado completo**: Vista de todos los usuarios registrados
- **Control de acceso**: Activar/desactivar cuentas de usuario
- **Filtros por rol**: Separar administradores de usuarios regulares
- **Búsqueda avanzada**: Encontrar usuarios por nombre o email

### 📝 Gestión de Solicitudes
- **Revisión de solicitudes**: Procesar peticiones de compra/venta
- **Estados de solicitud**: Aprobar, rechazar o mantener pendiente
- **Notas administrativas**: Comunicación con usuarios sobre sus solicitudes

### 📈 Generación de Informes
- **Informes de actividad**: Análisis completo por períodos
- **Informes de moderación**: Estadísticas de acciones administrativas
- **Exportación de datos**: Formato JSON y CSV
- **Filtros temporales**: Informes personalizados por fechas

## Estructura de Archivos

```
backend/src/
├── controllers/
│   └── admin.controller.js          # Lógica del panel administrativo
├── middlewares/
│   ├── auth.middleware.js           # Autenticación de usuarios
│   └── admin.middleware.js          # Verificación de permisos de admin
├── models/
│   ├── User.js                      # Modelo de usuario (actualizado)
│   ├── Item.js                      # Modelo de publicación (actualizado)
│   └── Request.js                   # Modelo de solicitud (actualizado)
├── routes/
│   └── admin.routes.js              # Rutas del panel administrativo
└── app.js                           # Configuración principal (actualizado)
```

## Instalación y Configuración

### 1. Dependencias
Asegúrate de tener todas las dependencias instaladas:
```bash
cd backend
npm install
```

### 2. Variables de Entorno
Configura las siguientes variables en tu archivo `.env`:
```env
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=1h
```

### 3. Base de Datos
Las tablas se crearán automáticamente con los nuevos campos:
- `items`: Agregados campos `adminNotes`, `reviewedBy`, `reviewedAt`
- `requests`: Agregado campo `adminNotes`
- `users`: Sin cambios (ya incluye campo `role`)

### 4. Crear Usuario Administrador
Para crear el primer administrador, puedes usar el endpoint de registro y luego actualizar manualmente el rol en la base de datos:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Uso de las APIs

### Autenticación
Todas las rutas requieren autenticación:
```bash
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
     http://localhost:3001/admin/stats/general
```

### Ejemplos de Uso

#### Obtener Estadísticas Generales
```bash
curl -H "Authorization: Bearer TU_TOKEN" \
     http://localhost:3001/admin/stats/general
```

#### Moderar una Publicación
```bash
curl -X PUT \
     -H "Authorization: Bearer TU_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status": "approved", "adminNotes": "Contenido aprobado"}' \
     http://localhost:3001/admin/items/1/status
```

#### Generar Informe de Actividad
```bash
curl -H "Authorization: Bearer TU_TOKEN" \
     "http://localhost:3001/admin/reports/activity?startDate=2024-01-01&endDate=2024-12-31"
```

## Estados del Sistema

### Estados de Publicaciones
- `pending`: Pendiente de revisión (nuevo estado por defecto)
- `approved`: Aprobada por administrador
- `rejected`: Rechazada por administrador
- `flagged`: Marcada para revisión especial
- `available`: Disponible para compra
- `sold`: Vendida
- `reserved`: Reservada

### Estados de Usuarios
- `active`: Cuenta activa
- `inactive`: Cuenta suspendida

### Estados de Solicitudes
- `pending`: Pendiente de revisión
- `accepted`: Aceptada
- `rejected`: Rechazada

## Seguridad

### Middleware de Autenticación
- Verificación de token JWT válido
- Validación de permisos de administrador
- Protección contra acceso no autorizado

### Validaciones
- Verificación de datos de entrada
- Sanitización de parámetros de consulta
- Manejo seguro de errores

## Monitoreo y Logs

El sistema incluye logging detallado para:
- Acciones administrativas
- Errores de autenticación
- Operaciones de moderación
- Generación de informes

## Próximas Mejoras

- [ ] Dashboard en tiempo real con WebSockets
- [ ] Notificaciones push para nuevas publicaciones
- [ ] Sistema de auditoría completo
- [ ] Exportación a Excel/PDF
- [ ] Filtros avanzados con múltiples criterios
- [ ] Sistema de roles más granular
- [ ] API para integración con herramientas externas

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo. 