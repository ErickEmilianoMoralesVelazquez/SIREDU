# API de Items - SIREDU (Actualizada con Favoritos)

## Descripción

La API de items ha sido actualizada para incluir integración completa con favoritos, filtros avanzados, paginación y transformación de datos para el frontend.

## Autenticación

Algunas rutas requieren autenticación JWT:
```
Authorization: Bearer <token>
```

## Base URL
```
http://localhost:3001/items
```

## Endpoints

### 📋 Consulta de Items

#### GET /items
Obtiene todos los artículos con filtros, paginación e información de favoritos.

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `search` (string): Buscar en título y descripción
- `category` (string): Filtrar por categoría
- `type` (string): Filtrar por tipo (Venta, Préstamo, Regalo)
- `priceRange` (string): Rango de precios (ej: "0-500", "500-1000", "5000+")
- `sortBy` (string): Ordenar por (recent, oldest, price_asc, price_desc)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Libro de Programación",
      "description": "Libro excelente para aprender...",
      "price": 250.00,
      "category": "Libros",
      "type": "Venta",
      "image": "/uploads/1234567890-libro.jpg",
      "images": [
        "/uploads/1234567890-libro.jpg",
        "/uploads/1234567891-libro2.jpg"
      ],
      "owner": "carlos_mendez",
      "createdAt": "2024-01-15T10:30:00Z",
      "isFavorite": true,
      "favoriteCount": 15,
      "status": "available",
      "user": {
        "id_user": 5,
        "username": "carlos_mendez",
        "email": "carlos@example.com"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "currentPage": 1,
    "totalPages": 10,
    "limit": 10
  }
}
```

#### GET /items/categories
Obtiene todas las categorías disponibles.

**Response (200):**
```json
{
  "success": true,
  "data": ["Libros", "Electrónicos", "Ropa", "Útiles", "Otros"]
}
```

#### GET /items/types
Obtiene todos los tipos disponibles.

**Response (200):**
```json
{
  "success": true,
  "data": ["Venta", "Préstamo", "Regalo"]
}
```

#### GET /items/:id
Obtiene un artículo específico con información de favoritos.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Libro de Cálculo Avanzado - Tercera Edición",
    "description": "Libro de cálculo avanzado en excelente estado...",
    "price": 250.00,
    "category": "Libros",
    "type": "Venta",
    "images": [
      "/uploads/1234567890-libro.jpg",
      "/uploads/1234567891-libro2.jpg",
      "/uploads/1234567892-libro3.jpg"
    ],
    "owner": "carlos_mendez",
    "createdAt": "2024-01-15T10:30:00Z",
    "isFavorite": true,
    "favoriteCount": 15,
    "status": "available",
    "condition": "Usado - Buen estado",
    "faculty": "Ingeniería",
    "user": {
      "id_user": 5,
      "username": "carlos_mendez",
      "email": "carlos@example.com"
    }
  }
}
```

### 📝 Creación de Items

#### POST /items
Crea un nuevo artículo (requiere autenticación).

**Content-Type:** `multipart/form-data`

**Form Data:**
- `tittle` (string, required): Título del artículo
- `description` (string, optional): Descripción del artículo
- `price` (number, optional): Precio del artículo
- `category` (string, required): Categoría del artículo
- `exchange_type` (string, required): Tipo de intercambio (Venta, Préstamo, Regalo)
- `status` (string, optional): Estado del artículo (default: "available")
- `picture1` (file, optional): Primera imagen
- `picture2` (file, optional): Segunda imagen
- `picture3` (file, optional): Tercera imagen

**Response (201):**
```json
{
  "success": true,
  "message": "Artículo creado exitosamente",
  "data": {
    "id_item": 1,
    "tittle": "Mi Artículo",
    "description": "Descripción del artículo",
    "price": "150.00",
    "category": "Electrónicos",
    "exchange_type": "Venta",
    "status": "available",
    "picture1": "1234567890-image1.jpg",
    "picture2": null,
    "picture3": null,
    "created_at": "2024-01-01T12:00:00.000Z",
    "user_id": 1,
    "User": {
      "username": "usuario",
      "email": "usuario@email.com"
    }
  }
}
```

## Campos de Favoritos

### Información Incluida en Items

Cuando se obtienen artículos, se incluye automáticamente:

- `isFavorite` (boolean): Indica si el usuario actual tiene este artículo en favoritos
- `favoriteCount` (number): Número total de usuarios que han marcado este artículo como favorito

### Ejemplo de Respuesta con Favoritos

```json
{
  "id": 1,
  "title": "Libro de Programación",
  "price": 250.00,
  "category": "Libros",
  "type": "Venta",
  "isFavorite": true,        // ← Nuevo campo
  "favoriteCount": 15,       // ← Nuevo campo
  "owner": "carlos_mendez",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Filtros y Búsqueda

### Parámetros de Filtrado

#### Búsqueda por Texto
```
GET /items?search=libro
```
Busca en título y descripción del artículo.

#### Filtro por Categoría
```
GET /items?category=Libros
```

#### Filtro por Tipo
```
GET /items?type=Venta
```

#### Filtro por Rango de Precio
```
GET /items?priceRange=0-500
GET /items?priceRange=500-1000
GET /items?priceRange=5000+
```

#### Ordenamiento
```
GET /items?sortBy=recent      # Más recientes primero
GET /items?sortBy=oldest      # Más antiguos primero
GET /items?sortBy=price_asc   # Precio: menor a mayor
GET /items?sortBy=price_desc  # Precio: mayor a menor
```

#### Combinación de Filtros
```
GET /items?category=Libros&type=Venta&priceRange=0-500&sortBy=price_asc&page=1&limit=10
```

## Paginación

### Estructura de Paginación

```json
{
  "pagination": {
    "total": 100,        // Total de artículos
    "currentPage": 1,    // Página actual
    "totalPages": 10,    // Total de páginas
    "limit": 10          // Elementos por página
  }
}
```

### Ejemplo de Uso

```
GET /items?page=2&limit=20
```

## Transformación de Datos

### Backend → Frontend

**Campos Transformados:**
- `id_item` → `id`
- `tittle` → `title`
- `exchange_type` → `type`
- `picture1` → `image` (imagen principal)
- `picture1, picture2, picture3` → `images` (array de imágenes)
- `User.username` → `owner`

**Campos Agregados:**
- `isFavorite`: Estado de favorito del usuario actual
- `favoriteCount`: Contador total de favoritos
- `condition`: Condición del artículo (para ProductDetailPage)
- `faculty`: Facultad (para ProductDetailPage)

## Estados de Respuesta

### ✅ Éxito
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente

### ⚠️ Errores del Cliente
- `400`: Datos inválidos o faltantes
- `401`: Token de autenticación requerido
- `404`: Artículo no encontrado

### ❌ Errores del Servidor
- `500`: Error interno del servidor

## Ejemplos de Uso

### Obtener Artículos con Filtros
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/items?category=Libros&type=Venta&priceRange=0-500&page=1&limit=10"
```

### Obtener Categorías
```bash
curl http://localhost:3001/items/categories
```

### Obtener Tipos
```bash
curl http://localhost:3001/items/types
```

### Obtener Artículo Específico
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/items/123
```

### Crear Nuevo Artículo
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "tittle=Mi Artículo" \
  -F "description=Descripción del artículo" \
  -F "price=150.00" \
  -F "category=Electrónicos" \
  -F "exchange_type=Venta" \
  -F "picture1=@/path/to/image1.jpg" \
  http://localhost:3001/items
```

## Compatibilidad con Frontend

### ProductsPage.jsx
- ✅ Filtros por categoría, tipo y precio
- ✅ Búsqueda por texto
- ✅ Ordenamiento
- ✅ Paginación
- ✅ Información de favoritos

### ProductDetailPage.jsx
- ✅ Información completa del artículo
- ✅ Múltiples imágenes
- ✅ Información de favoritos
- ✅ Datos del vendedor
- ✅ Campos adicionales (condition, faculty)

### ProductCard.jsx
- ✅ Información básica del artículo
- ✅ Estado de favorito
- ✅ Imagen principal
- ✅ Precio y tipo

## Consideraciones de Rendimiento

### Optimizaciones Implementadas

1. **Índices de Base de Datos**: Índices en campos de búsqueda y filtrado
2. **Paginación**: Límite de elementos por consulta
3. **Joins Optimizados**: Uso eficiente de relaciones
4. **Caché de Favoritos**: Consultas optimizadas para favoritos

### Métricas de Rendimiento

| Operación | Tiempo Esperado | Optimización |
|-----------|----------------|--------------|
| Lista de artículos | < 200ms | Paginación + joins |
| Artículo específico | < 100ms | Índice primario |
| Filtros | < 150ms | Índices compuestos |
| Búsqueda | < 300ms | Índices de texto |

## Integración con Favoritos

### Dependencias
- `FavoritesService`: Servicio para manejar favoritos
- `ItemsService`: Servicio principal de items
- Tabla `favorites`: Almacenamiento de favoritos

### Flujo de Datos
1. **Consulta de Items** → `ItemsService.getItems()`
2. **Información de Favoritos** → `FavoritesService.addFavoriteInfoToItems()`
3. **Transformación** → Datos adaptados al frontend
4. **Respuesta** → JSON con información completa 