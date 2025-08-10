import { apiService } from './api.js';

class AdminService {
  // ===== ESTADÍSTICAS GENERALES =====
  
  // Obtener estadísticas generales para el dashboard
  async getGeneralStats() {
    try {
      const response = await apiService.get('/admin/stats/general');
      return {
        general: {
          totalUsers: response.general?.totalUsers || 0,
          totalItems: response.general?.totalItems || 0,
          totalRequests: response.general?.totalRequests || 0,
          activeUsers: response.general?.activeUsers || 0,
          availableItems: response.general?.availableItems || 0,
          soldItems: response.general?.soldItems || 0,
          pendingItems: response.general?.pendingItems || 0
        },
        categoryStats: response.categoryStats || [],
        typeStats: response.typeStats || [],
        recentItems: response.recentItems || []
      };
    } catch (error) {
      console.error('Error fetching general stats:', error);
      // Retornar datos de ejemplo si hay error
      return {
        general: {
          totalUsers: 523,
          totalItems: 1248,
          totalRequests: 75,
          activeUsers: 120,
          availableItems: 300,
          soldItems: 200,
          pendingItems: 15
        },
        categoryStats: [],
        typeStats: [],
        recentItems: []
      };
    }
  }

  // ===== GESTIÓN DE ARTÍCULOS =====
  
  // Obtener todos los artículos con filtros y paginación
  async getItems(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);

      const endpoint = `/admin/items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      
      return {
        items: response.items || [],
        total: response.total || 0,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1
      };
    } catch (error) {
      console.error('Error fetching items:', error);
      return {
        items: [],
        total: 0,
        currentPage: 1,
        totalPages: 1
      };
    }
  }

  // Obtener un artículo específico
  async getItemById(id) {
    try {
      const response = await apiService.get(`/admin/items/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  // Actualizar estado de un artículo
  async updateItemStatus(id, status, adminNotes = '') {
    try {
      const response = await apiService.put(`/admin/items/${id}/status`, {
        status,
        adminNotes
      });
      return response;
    } catch (error) {
      console.error('Error updating item status:', error);
      throw error;
    }
  }

  // Eliminar un artículo
  async deleteItem(id) {
    try {
      const response = await apiService.delete(`/admin/items/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // ===== GESTIÓN DE USUARIOS =====
  
  // Obtener todos los usuarios
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.role) queryParams.append('role', params.role);
      if (params.search) queryParams.append('search', params.search);

      const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      
      return {
        users: response.users || [],
        total: response.total || 0,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        users: [],
        total: 0,
        currentPage: 1,
        totalPages: 1
      };
    }
  }

  // Actualizar estado de un usuario
  async updateUserStatus(id, status) {
    try {
      const response = await apiService.put(`/admin/users/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // ===== GESTIÓN DE SOLICITUDES =====
  
  // Obtener todas las solicitudes
  async getRequests(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);

      const endpoint = `/admin/requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      
      return {
        requests: response.requests || [],
        total: response.total || 0,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1
      };
    } catch (error) {
      console.error('Error fetching requests:', error);
      return {
        requests: [],
        total: 0,
        currentPage: 1,
        totalPages: 1
      };
    }
  }

  // Actualizar estado de una solicitud
  async updateRequestStatus(id, status, adminNotes = '') {
    try {
      const response = await apiService.put(`/admin/requests/${id}/status`, {
        status,
        adminNotes
      });
      return response;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }

  // ===== INFORMES =====
  
  // Generar informe de actividad
  async generateActivityReport(startDate, endDate, format = 'json') {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('startDate', startDate);
      queryParams.append('endDate', endDate);
      queryParams.append('format', format);

      const endpoint = `/admin/reports/activity?${queryParams.toString()}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error generating activity report:', error);
      throw error;
    }
  }

  // Generar informe de moderación
  async generateModerationReport(startDate, endDate) {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const endpoint = `/admin/reports/moderation?${queryParams.toString()}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error generating moderation report:', error);
      throw error;
    }
  }

  // ===== UTILIDADES =====
  
  // Convertir datos del backend al formato esperado por el frontend
  transformItemData(item) {
    return {
      id: item.id_item,
      title: item.tittle,
      category: item.category,
      type: item.type,
      price: parseFloat(item.price) || 0,
      owner: item.User?.username || 'Usuario desconocido',
      status: item.status,
      createdAt: item.created_at,
      description: item.description,
      adminNotes: item.adminNotes
    };
  }

  transformUserData(user) {
    return {
      id: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.created_at
    };
  }

  // Obtener datos de ejemplo para desarrollo
  getMockData() {
    return {
      stats: [
        {
          label: "Usuarios Registrados",
          value: 523,
          icon: "Users",
          color: "bg-blue-100 text-blue-600",
        },
        {
          label: "Artículos Activos",
          value: 1248,
          icon: "Package",
          color: "bg-emerald-100 text-emerald-600",
        },
        {
          label: "Artículos Donados",
          value: 342,
          icon: "Gift",
          color: "bg-purple-100 text-purple-600",
        },
        {
          label: "Pendientes de Revisión",
          value: 15,
          icon: "Clock",
          color: "bg-amber-100 text-amber-600",
        },
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
        {
          id: 2,
          title: "Laptop Dell Inspiron",
          category: "Electrónicos",
          type: "Venta",
          price: 4500,
          owner: "Ana Gutiérrez",
          status: "active",
          createdAt: "2023-05-14",
        },
        {
          id: 3,
          title: "Sudadera Universitaria",
          category: "Ropa",
          type: "Regalo",
          price: 0,
          owner: "Miguel Torres",
          status: "active",
          createdAt: "2023-05-13",
        },
        {
          id: 4,
          title: "Calculadora Científica",
          category: "Útiles",
          type: "Préstamo",
          price: 0,
          owner: "Laura Sánchez",
          status: "inactive",
          createdAt: "2023-05-12",
        },
        {
          id: 5,
          title: "Libro de Programación en Python",
          category: "Libros",
          type: "Venta",
          price: 180,
          owner: "Roberto Díaz",
          status: "active",
          createdAt: "2023-05-11",
        },
      ]
    };
  }
}

export const adminService = new AdminService(); 