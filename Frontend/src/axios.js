import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  headers: { 
    Accept: "application/json",
  },
});

// Interceptor para agregar el CSRF token automáticamente
client.interceptors.request.use(
  (config) => {
    // Obtener el token CSRF de las cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (token) {
      // Decodificar el token (Laravel lo envía URL-encoded)
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores CSRF (con protección anti-loop)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Solo reintentar una vez por petición
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await client.get('/sanctum/csrf-cookie');
        return client(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;