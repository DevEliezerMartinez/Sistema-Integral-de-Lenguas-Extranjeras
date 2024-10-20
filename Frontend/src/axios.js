import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

client.interceptors.response.use(
  (response) => response,
  async error => {
    // Si el código de estado es 419, realizar una petición GET a /sanctum/csrf-cookie
    if (error.response && error.response.status === 419) {
      await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`);
      // Intentar la solicitud original de nuevo
      return axios(error.config);
    }
    // Si no es un código de estado 419, simplemente rechazar la promesa con el error original
    return Promise.reject(error);
  }
);
export default client;
