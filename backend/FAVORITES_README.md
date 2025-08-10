# Funcionalidad de Favoritos - SIREDU

## Descripción

La funcionalidad de favoritos permite a los usuarios marcar artículos como favoritos y crear una lista de seguimiento personalizada. Esta característica mejora significativamente la experiencia del usuario al permitir guardar y acceder fácilmente a publicaciones de su interés.

## Características Principales

### ❤️ Gestión de Favoritos
- **Marcar como favorito**: Los usuarios pueden marcar cualquier artículo como favorito
- **Desmarcar favorito**: Remover artículos de la lista de favoritos
- **Verificación de estado**: Verificar si un artículo está marcado como favorito
- **Prevención de duplicados**: Un usuario no puede tener el mismo artículo en favoritos múltiples veces

### 📋 Lista de Favoritos
- **Vista personalizada**: Cada usuario ve solo sus propios favoritos
- **Paginación**: Navegación eficiente con paginación
- **Filtros avanzados**: Búsqueda por texto, categoría y ordenamiento
- **Información completa**: Incluye todos los datos del artículo y del vendedor

### 📊 Estadísticas y Métricas
- **Contador de favoritos**: Número total de usuarios que han marcado un artículo
- **Estadísticas personales**: Total de favoritos del usuario por categoría
- **Favoritos recientes**: Artículos agregados en los últimos 7 días
- **Artículos populares**: Lista de artículos más favoriteados

### 🔥 Funcionalidades Avanzadas
- **Artículos más favoriteados**: Ranking de artículos populares
- **Recomendaciones**: Sugerencias basadas en categorías favoritas
- **Integración completa**: Información de favoritos incluida en todos los artículos

## Estructura de Archivos

```
backend/src/
├── models/
│   ├── Favorite.js                    # Modelo de favoritos
│   └── index.js                       # Relaciones actualizadas
├── controllers/
│   └── favorites.controller.js        # Lógica de favoritos
├── routes/
│   └── favorites.routes.js            # Rutas de favoritos
├── services/
│   └── favoritesService.js            # Servicio de integración
└── app.js                             # Configuración principal
```

## Instalación y Configuración

### 1. Base de Datos

La tabla `favorites` se creará automáticamente con la siguiente estructura:

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

### 2. Índices Optimizados

```sql
-- Índice único para prevenir duplicados
CREATE UNIQUE INDEX unique_user_item_favorite ON favorites(user_id, item_id);

-- Índices para consultas eficientes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_item_id ON favorites(item_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at);
```

### 3. Variables de Entorno

No se requieren variables adicionales. La funcionalidad utiliza la configuración existente.

## Endpoints Disponibles

### Gestión de Favoritos
```
POST   /favorites/items/:itemId/favorite     # Agregar a favoritos
DELETE /favorites/items/:itemId/favorite     # Remover de favoritos
GET    /favorites/items/:itemId/favorite     # Verificar estado
```

### Consulta de Favoritos
```
GET    /favorites/favorites                  # Lista de favoritos del usuario
GET    /favorites/favorites/stats            # Estadísticas de favoritos
```

### Información de Artículos
```
GET    /favorites/items/:itemId/favorite-count  # Contador de favoritos
GET    /favorites/most-favorited               # Artículos más populares
```

## Flujo de Usuario

### 1. Marcar como Favorito
```javascript
// Frontend: Usuario hace clic en el ícono de corazón
const response = await fetch('/favorites/items/123/favorite', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Backend: Validaciones
// ✅ Artículo existe
// ✅ Usuario no es el propietario
// ✅ No está duplicado
// ✅ Se crea el registro
```

### 2. Verificar Estado
```javascript
// Frontend: Mostrar ícono lleno/vacío
const response = await fetch('/favorites/items/123/favorite', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Response: { isFavorite: true, favoriteId: 1 }
```

### 3. Lista de Favoritos
```javascript
// Frontend: Cargar lista de favoritos
const response = await fetch('/favorites/favorites?page=1&limit=10');

// Response: Lista paginada con información completa
```

## Integración con Artículos

### Información Incluida

Cuando se obtienen artículos, se incluye automáticamente:

```json
{
  "id_item": 123,
  "tittle": "Libro de Programación",
  "price": 250.00,
  "category": "Libros",
  "isFavorite": true,        // ← Nuevo campo
  "favoriteCount": 15,       // ← Nuevo campo
  "user": {
    "id_user": 5,
    "username": "carlos_mendez"
  }
}
```

### Servicio de Integración

El `FavoritesService` proporciona métodos para:

- `addFavoriteInfoToItem()`: Agregar información de favoritos a un artículo
- `addFavoriteInfoToItems()`: Agregar información a múltiples artículos
- `getItemsWithFavorites()`: Obtener artículos con información de favoritos
- `getMostFavoritedItems()`: Obtener artículos populares
- `getRecommendations()`: Obtener recomendaciones personalizadas

## Validaciones y Seguridad

### Reglas de Negocio

1. **Autenticación Obligatoria**: Todas las operaciones requieren usuario autenticado
2. **Prevención de Auto-favoritos**: Los usuarios no pueden marcar sus propios artículos
3. **Prevención de Duplicados**: Índice único en base de datos
4. **Eliminación en Cascada**: Si se elimina un artículo, se eliminan sus favoritos

### Validaciones del Backend

```javascript
// Verificar que el artículo existe
const item = await Item.findByPk(itemId);
if (!item) {
  return res.status(404).json({ error: "Artículo no encontrado" });
}

// Verificar que no es el propio artículo
if (item.user_id === userId) {
  return res.status(400).json({ error: "No puedes marcar tu propio artículo" });
}

// Verificar que no está duplicado
const existingFavorite = await Favorite.findOne({
  where: { user_id: userId, item_id: itemId }
});
if (existingFavorite) {
  return res.status(409).json({ error: "Ya está en favoritos" });
}
```

## Rendimiento y Optimización

### Consultas Optimizadas

1. **Índices Estratégicos**: Índices en `user_id`, `item_id` y `created_at`
2. **Joins Eficientes**: Uso de `include` para obtener datos relacionados
3. **Paginación**: Límite de elementos por página
4. **Caché de Contadores**: Contadores calculados eficientemente

### Métricas de Rendimiento

| Operación | Tiempo Esperado | Optimización |
|-----------|----------------|--------------|
| Agregar favorito | < 100ms | Índice único |
| Verificar estado | < 50ms | Índice compuesto |
| Lista de favoritos | < 200ms | Paginación + joins |
| Contador de favoritos | < 50ms | Índice en item_id |

## Casos de Uso

### 1. Usuario Explora Artículos
- Ve íconos de corazón en cada artículo
- Puede marcar/desmarcar favoritos
- Ve contador de favoritos de cada artículo

### 2. Usuario Accede a Sus Favoritos
- Navega a sección "Mis Favoritos"
- Ve lista paginada de artículos favoritos
- Puede buscar y filtrar favoritos

### 3. Usuario Ve Artículos Populares
- Accede a sección "Más Populares"
- Ve ranking de artículos más favoriteados
- Puede filtrar por categoría

### 4. Sistema de Recomendaciones
- Basado en categorías favoritas del usuario
- Sugiere artículos similares
- Excluye artículos ya en favoritos

## Pruebas

### Pruebas Unitarias Recomendadas

```javascript
// Agregar a favoritos
test('should add item to favorites', async () => {
  // Arrange
  const userId = 1;
  const itemId = 123;
  
  // Act
  const result = await addToFavorites(userId, itemId);
  
  // Assert
  expect(result.isFavorite).toBe(true);
});

// Verificar duplicados
test('should prevent duplicate favorites', async () => {
  // Arrange
  const userId = 1;
  const itemId = 123;
  
  // Act & Assert
  await expect(addToFavorites(userId, itemId)).rejects.toThrow('Ya está en favoritos');
});

// Prevenir auto-favoritos
test('should prevent self-favoriting', async () => {
  // Arrange
  const userId = 1;
  const itemId = 123; // Pertenece al usuario 1
  
  // Act & Assert
  await expect(addToFavorites(userId, itemId)).rejects.toThrow('No puedes marcar tu propio artículo');
});
```

## Próximas Mejoras

### Funcionalidades Futuras

- [ ] **Notificaciones**: Alertas cuando artículos favoritos cambian de precio
- [ ] **Listas personalizadas**: Crear múltiples listas de favoritos
- [ ] **Compartir favoritos**: Compartir lista de favoritos con otros usuarios
- [ ] **Sincronización**: Sincronizar favoritos entre dispositivos
- [ ] **Exportar favoritos**: Exportar lista en formato CSV/PDF
- [ ] **Favoritos privados**: Opción de hacer favoritos privados

### Optimizaciones Técnicas

- [ ] **Caché Redis**: Cachear contadores de favoritos
- [ ] **WebSockets**: Actualizaciones en tiempo real
- [ ] **Búsqueda avanzada**: Búsqueda semántica en favoritos
- [ ] **Analytics**: Métricas detalladas de uso de favoritos

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades relacionadas con favoritos, contacta al equipo de desarrollo.

### Logs de Depuración

```javascript
// Habilitar logs detallados
console.log('Adding to favorites:', { userId, itemId });
console.log('Favorite created:', favorite);
console.log('Error adding favorite:', error);
``` 