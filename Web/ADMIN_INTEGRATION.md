# Integración del Panel Administrativo - Frontend y Backend

## Descripción

Este documento explica cómo el frontend (`AdminDashboardPage.jsx`) se integra con las APIs del backend para crear un panel administrativo funcional.

## Estructura de Integración

### 1. Servicio de Administración (`adminService.js`)

El archivo `Web/src/services/adminService.js` actúa como puente entre el frontend y las APIs del backend:

```javascript
import { apiService } from './api.js';
import { adminService } from '../services/adminService.js';
```

#### Funciones Principales:

- **`getGeneralStats()`**: Obtiene estadísticas generales del dashboard
- **`getItems(params)`**: Obtiene artículos con filtros y paginación
- **`getUsers(params)`**: Obtiene usuarios con filtros
- **`getRequests(params)`**: Obtiene solicitudes
- **`transformItemData(item)`**: Convierte datos del backend al formato del frontend
- **`transformUserData(user)`**: Convierte datos de usuario

### 2. Transformación de Datos

#### Backend → Frontend

**Artículos:**
```javascript
// Backend
{
  id_item: 1,
  tittle: "Libro de Cálculo",
  category: "Libros",
  type: "Venta",
  price: "250.00",
  user_id: 1,
  status: "pending",
  created_at: "2024-01-15T10:30:00Z",
  User: { username: "Carlos Méndez" }
}

// Frontend (transformado)
{
  id: 1,
  title: "Libro de Cálculo",
  category: "Libros",
  type: "Venta",
  price: 250,
  owner: "Carlos Méndez",
  status: "pending",
  createdAt: "2024-01-15T10:30:00Z"
}
```

**Estadísticas:**
```javascript
// Backend
{
  general: {
    totalUsers: 523,
    totalItems: 1248,
    totalRequests: 75,
    activeUsers: 120,
    availableItems: 300,
    soldItems: 200,
    pendingItems: 15
  }
}

// Frontend (transformado)
[
  {
    label: "Usuarios Registrados",
    value: 523,
    icon: Users,
    color: "bg-blue-100 text-blue-600"
  },
  // ... más estadísticas
]
```

### 3. Estados del Sistema

#### Estados de Artículos (Backend → Frontend)
- `pending` → "Pendiente de Revisión"
- `approved` → "Aprobado"
- `rejected` → "Rechazado"
- `flagged` → "Marcado"
- `available` → "Disponible"
- `sold` → "Vendido"
- `reserved` → "Reservado"

#### Estados de Usuarios
- `active` → "Activo"
- `inactive` → "Inactivo"

### 4. Manejo de Errores

El sistema incluye manejo robusto de errores:

```javascript
try {
  const statsData = await adminService.getGeneralStats();
  // Procesar datos
} catch (err) {
  console.error('Error loading dashboard data:', err);
  setError('Error al cargar los datos del dashboard');
  // Usar datos de ejemplo como fallback
  const mockData = adminService.getMockData();
  setStats(mockData.stats);
}
```

### 5. Carga de Datos

#### Dashboard (Carga Inicial)
```javascript
useEffect(() => {
  loadDashboardData();
}, []);

const loadDashboardData = async () => {
  // Carga estadísticas generales
  const statsData = await adminService.getGeneralStats();
  
  // Carga productos recientes
  const itemsData = await adminService.getItems({ page: 1, limit: 10 });
  
  // Transforma y actualiza el estado
  setStats(transformedStats);
  setProducts(transformedProducts);
};
```

#### Pestaña de Productos (Carga Bajo Demanda)
```javascript
const loadProducts = async (filters = {}) => {
  const itemsData = await adminService.getItems({
    page: currentPage,
    limit: 10,
    ...filters
  });
  setProducts(transformedProducts);
};
```

### 6. Filtros y Búsqueda

#### Búsqueda en Tiempo Real
```javascript
useEffect(() => {
  if (activeTab === "products") {
    loadProducts({ search: searchTerm });
  }
}, [searchTerm, activeTab]);
```

#### Parámetros de Filtrado
- `page`: Página actual
- `limit`: Elementos por página
- `status`: Estado del artículo
- `category`: Categoría
- `search`: Término de búsqueda

### 7. Autenticación

Todas las peticiones incluyen el token JWT automáticamente:

```javascript
// En apiService.js
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### 8. Paginación

```javascript
// Frontend
const [currentPage, setCurrentPage] = useState(1);

// Backend response
{
  items: [...],
  total: 100,
  currentPage: 1,
  totalPages: 10
}
```

## Flujo de Datos Completo

1. **Usuario accede al dashboard**
   - Frontend llama a `loadDashboardData()`
   - Se ejecutan `getGeneralStats()` y `getItems()`

2. **Usuario cambia a pestaña de productos**
   - Frontend llama a `loadProducts()`
   - Se ejecuta `getItems()` con parámetros

3. **Usuario busca productos**
   - Frontend actualiza `searchTerm`
   - Se ejecuta `getItems()` con filtro de búsqueda

4. **Usuario cambia página**
   - Frontend actualiza `currentPage`
   - Se ejecuta `getItems()` con nueva página

## Compatibilidad

### Campos Requeridos del Backend

**Artículos (`items` table):**
- `id_item` (INTEGER, PRIMARY KEY)
- `tittle` (STRING)
- `description` (TEXT)
- `price` (DECIMAL)
- `category` (STRING)
- `type` (STRING)
- `status` (ENUM)
- `created_at` (DATE)
- `user_id` (INTEGER, FOREIGN KEY)
- `adminNotes` (TEXT, opcional)
- `reviewedBy` (INTEGER, opcional)
- `reviewedAt` (DATE, opcional)

**Usuarios (`users` table):**
- `id_user` (INTEGER, PRIMARY KEY)
- `username` (STRING)
- `email` (STRING)
- `role` (ENUM: 'admin', 'user')
- `status` (ENUM: 'active', 'inactive')
- `created_at` (DATE)

**Solicitudes (`requests` table):**
- `id_request` (INTEGER, PRIMARY KEY)
- `message` (TEXT)
- `status` (ENUM: 'pending', 'accepted', 'rejected')
- `created_at` (DATE)
- `item_id` (INTEGER, FOREIGN KEY)
- `adminNotes` (TEXT, opcional)

### Endpoints Requeridos

```
GET    /admin/stats/general
GET    /admin/items
GET    /admin/items/:id
PUT    /admin/items/:id/status
DELETE /admin/items/:id
GET    /admin/users
PUT    /admin/users/:id/status
GET    /admin/requests
PUT    /admin/requests/:id/status
GET    /admin/reports/activity
GET    /admin/reports/moderation
```

## Pruebas

### Datos de Prueba

El sistema incluye datos de ejemplo que se cargan automáticamente si hay errores de conexión:

```javascript
getMockData() {
  return {
    stats: [
      {
        label: "Usuarios Registrados",
        value: 523,
        icon: "Users",
        color: "bg-blue-100 text-blue-600",
      },
      // ... más estadísticas
    ],
    products: [
      {
        id: 1,
        title: "Libro de Cálculo Avanzado",
        category: "Libros",
        type: "Venta",
        price: 250,
        owner: "Carlos Méndez",
        status: "active",
        createdAt: "2023-05-15",
      },
      // ... más productos
    ]
  };
}
```

### Verificación de Integración

1. **Verificar conexión al backend**
2. **Probar carga de estadísticas**
3. **Probar carga de productos**
4. **Probar filtros y búsqueda**
5. **Probar paginación**
6. **Verificar manejo de errores**

## Troubleshooting

### Problemas Comunes

1. **Error 401/403**: Verificar token JWT y permisos de administrador
2. **Datos no cargan**: Verificar conexión al backend y endpoints
3. **Errores de transformación**: Verificar estructura de datos del backend
4. **Filtros no funcionan**: Verificar parámetros de query

### Logs de Depuración

```javascript
console.error('Error loading dashboard data:', err);
console.error('Error fetching items:', error);
console.error('Error updating item status:', error);
``` 