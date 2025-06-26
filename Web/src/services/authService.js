import { apiService } from './api.js';

class AuthService {
  constructor() {
    this.tokenKey = 'authToken';
    this.userKey = 'userData';
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error en el registro');
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);

      if (response.token) {
        this.setToken(response.token);

        // Decode token to get user data
        const userData = this.decodeToken(response.token);
        this.setUserData(userData);

        return { success: true, user: userData };
      }

      throw new Error('No se recibió token de autenticación');
    } catch (error) {
      throw new Error(error.message || 'Error en el inicio de sesión');
    }
  }

  // Logout user
  logout() {
    this.removeToken();
    this.removeUserData();
  }

  // Token management
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // User data management
  setUserData(userData) {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  getUserData() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  removeUserData() {
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.logout();
      return false;
    }
  }

  // Decode JWT token
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Token inválido');
    }
  }

  // Get current user
  getCurrentUser() {
    if (!this.isAuthenticated()) return null;
    return this.getUserData();
  }

  // Initialize auth state (call on app start)
  initializeAuth() {
    return this.isAuthenticated() ? this.getCurrentUser() : null;
  }
}

export const authService = new AuthService();
