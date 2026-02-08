# Stage 1: Build del frontend React
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY Frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY Frontend/ ./

# Build de producción
# La URL de la API será configurada en tiempo de ejecución
ARG VITE_API_URL=http://localhost
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine

# Copiar el build del frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx para SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
