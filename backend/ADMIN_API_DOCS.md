# Panel Administrativo - Documentación de APIs

## Autenticación

Todas las rutas del panel administrativo requieren:
1. Token de autenticación válido en el header: `Authorization: Bearer <token>`
2. Usuario con rol de administrador

## Base URL
```
http://localhost:3001/admin
```

## Endpoints

### 📋 Moderación de Publicaciones

#### GET /admin/items
Obtiene todas las publicaciones con filtros y paginación.

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `status` (string): Filtrar por estado (available, sold, reserved, pending, approved, rejected, flagged)
- `category` (string): Filtrar por categoría
- `search` (string): Buscar en título y descripción

**Response:**
```json
{
  "items": [...],
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

#### GET /admin/items/:id
Obtiene una publicación específica con información del usuario.

**Response:**
```json
{
  "id_item": 1,
  "tittle": "Producto",
  "description": "Descripción",
  "price": 100.00,
  "status": "pending",
  "category": "Electrónicos",
  "user": {
    "id_user": 1,
    "username": "usuario1",
    "email": "user@example.com"
  }
}
```

#### PUT /admin/items/:id/status
Actualiza el estado de una publicación.

**Body:**
```json
{
  "status": "approved",
  "adminNotes": "Notas del administrador"
}
```

#### DELETE /admin/items/:id
Elimina una publicación.

### 📊 Estadísticas

#### GET /admin/stats/general
Obtiene estadísticas generales del sistema.

**Response:**
```json
{
  "general": {
    "totalUsers": 150,
    "totalItems": 500,
    "totalRequests": 75,
    "activeUsers": 120,
    "availableItems": 300,
    "soldItems": 200
  },
  "categoryStats": [
    {
      "category": "Electrónicos",
      "count": 150
    }
  ],
  "typeStats": [...],
  "recentItems": [...]
}
```

#### GET /admin/stats/date-range
Obtiene estadísticas por rango de fechas.

**Query Parameters:**
- `startDate` (string): Fecha de inicio (YYYY-MM-DD)
- `endDate` (string): Fecha de fin (YYYY-MM-DD)

### 👥 Gestión de Usuarios

#### GET /admin/users
Obtiene todos los usuarios con filtros y paginación.

**Query Parameters:**
- `page` (number): Página actual
- `limit` (number): Elementos por página
- `status` (string): Filtrar por estado (active, inactive)
- `role` (string): Filtrar por rol (admin, user)
- `search` (string): Buscar en username y email

#### PUT /admin/users/:id/status
Actualiza el estado de un usuario.

**Body:**
```json
{
  "status": "inactive"
}
```

### 📝 Gestión de Solicitudes

#### GET /admin/requests
Obtiene todas las solicitudes con información del item y usuario.

**Query Parameters:**
- `page` (number): Página actual
- `limit` (number): Elementos por página
- `status` (string): Filtrar por estado (pending, accepted, rejected)
- `search` (string): Buscar en mensaje

#### PUT /admin/requests/:id/status
Actualiza el estado de una solicitud.

**Body:**
```json
{
  "status": "accepted",
  "adminNotes": "Solicitud aprobada"
}
```

### 📈 Informes

#### GET /admin/reports/activity
Genera informe de actividad por rango de fechas.

**Query Parameters:**
- `startDate` (string): Fecha de inicio (YYYY-MM-DD)
- `endDate` (string): Fecha de fin (YYYY-MM-DD)
- `format` (string): Formato de salida (json, csv)

#### GET /admin/reports/moderation
Genera informe de moderación.

**Query Parameters:**
- `startDate` (string): Fecha de inicio (YYYY-MM-DD)
- `endDate` (string): Fecha de fin (YYYY-MM-DD)

## Estados de Publicaciones

- `pending`: Pendiente de revisión
- `approved`: Aprobada
- `rejected`: Rechazada
- `flagged`: Marcada para revisión
- `available`: Disponible para compra
- `sold`: Vendida
- `reserved`: Reservada

## Estados de Usuarios

- `active`: Activo
- `inactive`: Inactivo

## Estados de Solicitudes

- `pending`: Pendiente
- `accepted`: Aceptada
- `rejected`: Rechazada

## Códigos de Error

- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - Token no válido
- `403`: Forbidden - Sin permisos de administrador
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor 