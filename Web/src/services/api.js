// src/services/api.js

// Usa la URL del .env si existe; si no, fallback a localhost:3001
const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "http://localhost:3001";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Soporte de params -> ?a=1&b=2 (omite null/undefined/"")
    const qs =
      options.params && typeof options.params === "object"
        ? new URLSearchParams(
            Object.entries(options.params).reduce((acc, [k, v]) => {
              if (v !== undefined && v !== null && v !== "") acc[k] = v;
              return acc;
            }, {})
          ).toString()
        : "";

    const url = `${this.baseURL}${endpoint}${qs ? `?${qs}` : ""}`;

    // Token
    const token = localStorage.getItem("authToken");

    // ¿Es FormData?
    const isFormData = options.body instanceof FormData;

    // No fijar Content-Type si es FormData (el navegador añade el boundary)
    const baseHeaders = isFormData
      ? {}
      : { "Content-Type": "application/json" };

    const config = {
      method: options.method || "GET",
      headers: {
        ...baseHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      // Permite AbortController: new AbortController().signal
      signal: options.signal,
      // Si te autenticas por cookies cross-site, cambia a "include"
      credentials: options.credentials || "same-origin",
    };

    // Normaliza el body
    if (options.body !== undefined) {
      if (isFormData) {
        config.body = options.body;
      } else if (typeof options.body === "string") {
        config.body = options.body;
      } else {
        config.body = JSON.stringify(options.body || {});
      }
    }

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get("content-type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await response.json().catch(() => ({}));
      } else {
        data = await response.text().catch(() => "");
      }

      if (!response.ok) {
        const message =
          (data && (data.message || data.error)) ||
          `HTTP ${response.status} ${response.statusText}`;
        const err = new Error(message);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      // Mantengo compat: devolvemos el JSON directo (no { data })
      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Helpers

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { method: "POST", body: data, ...options });
  }

  // Subida de archivos con FormData
  async postForm(endpoint, formData, options = {}) {
    return this.request(endpoint, { method: "POST", body: formData, ...options });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { method: "PUT", body: data, ...options });
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { method: "PATCH", body: data, ...options });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }
}

export const apiService = new ApiService();
export default apiService;
