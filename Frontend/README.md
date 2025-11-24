# Frontend - Sistema de Gestión de Lenguas Extranjeras

Esta es la aplicación cliente (Frontend) del Sistema de Gestión de Lenguas Extranjeras, construida con **React** y **Vite**.

## Requisitos Previos

- **Node.js** (versión 18 o superior recomendada).
- **NPM** (incluido con Node.js).

## Instalación Local

Si deseas ejecutar el frontend de manera aislada (sin Docker) para desarrollo:

1.  Navega a la carpeta del frontend:
    ```bash
    cd Frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Configura las variables de entorno:
    -   Crea un archivo `.env` basado en algún ejemplo si es necesario.
    -   Asegúrate de definir la URL del backend si es diferente a `localhost`.

4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible generalmente en `http://localhost:5173`.

## Construcción para Producción

Para generar los archivos estáticos optimizados para producción:

```bash
npm run build
```

Los archivos generados se guardarán en la carpeta `dist`.

## Docker

En el entorno de producción con Docker, este frontend es servido por **Nginx**.
La configuración de construcción se encuentra en `Dockerfile.prod` y se orquesta mediante `docker-compose.prod.yml` en la raíz del proyecto.

## Estructura del Proyecto

-   `src/`: Código fuente de la aplicación React.
-   `public/`: Archivos estáticos públicos.
-   `vite.config.js`: Configuración de Vite.
