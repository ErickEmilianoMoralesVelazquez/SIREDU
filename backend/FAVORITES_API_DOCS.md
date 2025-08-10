# API de Favoritos - SIREDU

## Descripción

La API de favoritos permite a los usuarios marcar y gestionar artículos como favoritos, mejorando la experiencia de usuario al permitir guardar y acceder fácilmente a publicaciones de su interés.

## Autenticación

Todas las rutas requieren autenticación JWT:
```
Authorization: Bearer <token>
```

## Base URL
```
http://localhost:3001/favorites
```

## Endpoints

### ❤️ Gestión de Favoritos

#### POST /favorites/items/:itemId/favorite
Agrega un artículo a los favoritos del usuario.

**Parámetros:**
- `itemId` (path): ID del artículo a agregar

**Response (201):**
```json
{
  "message": "Artículo agregado a favoritos",
  "favorite": {
    "id_favorite": 1,
    "item_id": 123,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Errores:**
- `400`: No puedes marcar tu propio artículo como favorito
- `404`: Artículo no encontrado
- `409`: El artículo ya está en tus favoritos

#### DELETE /favorites/items/:itemId/favorite
Remueve un artículo de los favoritos del usuario.

**Parámetros:**
- `itemId` (path): ID del artículo a remover

**Response (200):**
```json
{
  "message": "Artículo removido de favoritos"
}
```

**Errores:**
- `404`: El artículo no está en tus favoritos

#### GET /favorites/items/:itemId/favorite
Verifica si un artículo está en los favoritos del usuario.

**Parámetros:**
- `itemId` (path): ID del artículo a verificar

**Response (200):**
```json
{
  "isFavorite": true,
  "favoriteId": 1
}
```

### 📋 Consulta de Favoritos

#### GET /favorites/favorites
Obtiene todos los favoritos del usuario con paginación y filtros.

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `search` (string): Buscar en título y descripción
- `category` (string): Filtrar por categoría
- `sort` (string): Ordenar por campo (default: "created_at")

**Response (200):**
```json
{
  "favorites": [
    {
      "id_favorite": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "item": {
        "id_item": 123,
        "tittle": "Libro de Programación",
        "description": "Libro excelente para aprender...",
        "price": 250.00,
        "category": "Libros",
        "type": "Venta",
        "status": "available",
        "picture1": "libro.jpg",
        "picture2": null,
        "picture3": null,
        "created_at": "2024-01-10T15:20:00Z",
        "user": {
          "id_user": 5,
          "username": "carlos_mendez",
          "email": "carlos@example.com"
        }
      }
    }
  ],
  "total": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

### 📊 Estadísticas y Contadores

#### GET /favorites/items/:itemId/favorite-count
Obtiene el número total de favoritos de un artículo.

**Parámetros:**
- `itemId` (path): ID del artículo

**Response (200):**
```json
{
  "favoriteCount": 15
}
```

#### GET /favorites/favorites/stats
Obtiene estadísticas de favoritos del usuario.

**Response (200):**
```json
{
  "totalFavorites": 25,
  "favoritesByCategory": [
    {
      "category": "Libros",
      "count": 12
    },
    {
      "category": "Electrónicos",
      "count": 8
    },
    {
      "category": "Ropa",
      "count": 5
    }
  ],
  "recentFavorites": 3
}
```

### 🔥 Artículos Populares

#### GET /favorites/most-favorited
Obtiene los artículos más favoriteados.

**Query Parameters:**
- `limit` (number): Número de artículos (default: 10)
- `category` (string): Filtrar por categoría

**Response (200):**
```json
[
  {
    "id_item": 123,
    "tittle": "Libro de Programación",
    "description": "Libro excelente...",
    "price": 250.00,
    "category": "Libros",
    "type": "Venta",
    "status": "available",
    "picture1": "libro.jpg",
    "picture2": null,
    "picture3": null,
    "created_at": "2024-01-10T15:20:00Z",
    "favoriteCount": 25,
    "user": {
      "id_user": 5,
      "username": "carlos_mendez"
    }
  }
]
```

## Integración con Artículos

### Información de Favoritos en Artículos

Cuando se obtienen artículos, se puede incluir información de favoritos:

```json
{
  "id_item": 123,
  "tittle": "Libro de Programación",
  "description": "Libro excelente...",
  "price": 250.00,
  "category": "Libros",
  "type": "Venta",
  "status": "available",
  "picture1": "libro.jpg",
  "picture2": null,
  "picture3": null,
  "created_at": "2024-01-10T15:20:00Z",
  "isFavorite": true,
  "favoriteCount": 15,
  "user": {
    "id_user": 5,
    "username": "carlos_mendez",
    "email": "carlos@example.com"
  }
}
```

### Campos Adicionales

- `isFavorite` (boolean): Indica si el usuario actual tiene este artículo en favoritos
- `favoriteCount` (number): Número total de usuarios que han marcado este artículo como favorito

## Estados de Respuesta

### ✅ Éxito
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente

### ⚠️ Errores del Cliente
- `400`: No puedes marcar tu propio artículo como favorito
- `401`: Token de autenticación requerido
- `404`: Artículo no encontrado o no está en favoritos
- `409`: El artículo ya está en favoritos

### ❌ Errores del Servidor
- `500`: Error interno del servidor

## Ejemplos de Uso

### Agregar a Favoritos
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/favorites/items/123/favorite
```

### Remover de Favoritos
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/favorites/items/123/favorite
```

### Verificar Estado de Favorito
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/favorites/items/123/favorite
```

### Obtener Favoritos del Usuario
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/favorites/favorites?page=1&limit=10&search=libro"
```

### Obtener Artículos Más Favoriteados
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/favorites/most-favorited?limit=5&category=Libros"
```

## Consideraciones de Seguridad

1. **Autenticación Obligatoria**: Todas las rutas requieren token JWT válido
2. **Validación de Propiedad**: Los usuarios no pueden marcar sus propios artículos como favoritos
3. **Prevención de Duplicados**: Un usuario no puede tener el mismo artículo en favoritos múltiples veces
4. **Eliminación en Cascada**: Si se elimina un artículo, se eliminan automáticamente todos sus favoritos

## Límites y Restricciones

- **Límite de Favoritos**: No hay límite en el número de favoritos por usuario
- **Paginación**: Máximo 50 elementos por página
- **Búsqueda**: Búsqueda en título y descripción del artículo
- **Ordenamiento**: Por fecha de creación (más reciente primero)

## Base de Datos

### Tabla `favorites`
```sql
CREATE TABLE favorites (
  id_favorite INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_item_favorite (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id_item) ON DELETE CASCADE
);
```

### Índices
- `unique_user_item_favorite`: Índice único para prevenir duplicados
- `user_id`: Índice para consultas por usuario
- `item_id`: Índice para consultas por artículo
- `created_at`: Índice para ordenamiento por fecha 