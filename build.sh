#!/bin/bash
# =============================================================================
#  build.sh - Script de despliegue para Sistema Integral de Lenguas Extranjeras
#  Uso: bash build.sh
# =============================================================================

set -euo pipefail

# --- Colores para output ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# --- Funciones de log ---
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }
step()    { echo -e "\n${BOLD}${CYAN}==> $*${NC}"; }
divider() { echo -e "${CYAN}--------------------------------------------------------------${NC}"; }

# =============================================================================
# PASO 0: Bienvenida
# =============================================================================
clear
echo -e "${BOLD}${CYAN}"
echo "  ┌─────────────────────────────────────────────────────────┐"
echo "  │   Sistema Integral de Lenguas Extranjeras               │"
echo "  │   Script de despliegue Docker                           │"
echo "  └─────────────────────────────────────────────────────────┘"
echo -e "${NC}"

divider

# =============================================================================
# PASO 1: Verificar dependencias necesarias
# =============================================================================
step "Verificando dependencias del sistema..."

for cmd in docker; do
    if ! command -v "$cmd" &>/dev/null; then
        error "No se encontro '$cmd'. Instálalo antes de continuar."
        exit 1
    fi
    success "'$cmd' encontrado: $(docker --version 2>/dev/null || echo 'OK')"
done

# Verificar docker compose (v2 como plugin o v1 standalone)
if docker compose version &>/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
    success "Docker Compose (plugin v2) encontrado"
elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
    success "Docker Compose (standalone v1) encontrado"
else
    error "No se encontro 'docker compose' ni 'docker-compose'. Instálalo antes de continuar."
    exit 1
fi

# =============================================================================
# PASO 2: Detectar IP del sistema
# =============================================================================
step "Detectando IP de red local..."

# Intentar detectar la IP local (compatible Linux/macOS/Git Bash en Windows)
DETECTED_IP=""

if command -v hostname &>/dev/null; then
    DETECTED_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || true)
fi

# Fallback: ip route
if [ -z "$DETECTED_IP" ] && command -v ip &>/dev/null; then
    DETECTED_IP=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K[\d.]+' || true)
fi

# Fallback: ifconfig
if [ -z "$DETECTED_IP" ] && command -v ifconfig &>/dev/null; then
    DETECTED_IP=$(ifconfig | grep -E 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1 || true)
fi

if [ -n "$DETECTED_IP" ]; then
    info "IP detectada: ${BOLD}$DETECTED_IP${NC}"
else
    warn "No se pudo detectar la IP automáticamente."
fi

echo ""
echo -e "${YELLOW}Opciones de IP para el despliegue:${NC}"
echo "  1) Usar la IP detectada: ${BOLD}${DETECTED_IP:-N/A}${NC}"
echo "  2) Usar 'localhost'  (solo acceso desde esta maquina)"
echo "  3) Ingresar otra IP  (red personalizada)"
echo ""
read -rp "Selecciona una opcion [1/2/3]: " IP_CHOICE

case "$IP_CHOICE" in
    1)
        if [ -z "$DETECTED_IP" ]; then
            error "No hay IP detectada. Elige otra opción."
            exit 1
        fi
        HOST_IP="$DETECTED_IP"
        ;;
    2)
        HOST_IP="localhost"
        ;;
    3)
        read -rp "Ingresa la IP que deseas usar: " CUSTOM_IP
        if [[ ! "$CUSTOM_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && [ "$CUSTOM_IP" != "localhost" ]; then
            error "Formato de IP inválido: '$CUSTOM_IP'"
            exit 1
        fi
        HOST_IP="$CUSTOM_IP"
        ;;
    *)
        error "Opción inválida."
        exit 1
        ;;
esac

success "Se usará la IP: ${BOLD}$HOST_IP${NC}"

# =============================================================================
# PASO 3: Verificar imagenes/contenedores existentes
# =============================================================================
step "Verificando estado actual de Docker..."

EXISTING_CONTAINERS=$(docker ps -a --filter "name=lenguas_" --format "{{.Names}}" 2>/dev/null || true)
EXISTING_IMAGES=$(docker images --filter "reference=*lenguas*" --format "{{.Repository}}:{{.Tag}}" 2>/dev/null || true)

if [ -n "$EXISTING_CONTAINERS" ] || [ -n "$EXISTING_IMAGES" ]; then
    warn "Se encontraron recursos Docker existentes:"

    if [ -n "$EXISTING_CONTAINERS" ]; then
        echo -e "  ${YELLOW}Contenedores:${NC}"
        echo "$EXISTING_CONTAINERS" | sed 's/^/    - /'
    fi

    if [ -n "$EXISTING_IMAGES" ]; then
        echo -e "  ${YELLOW}Imagenes:${NC}"
        echo "$EXISTING_IMAGES" | sed 's/^/    - /'
    fi

    echo ""
    echo -e "${YELLOW}¿Qué deseas hacer?${NC}"
    echo "  1) Limpiar todo e instalar en limpio (recomendado)"
    echo "  2) Cancelar"
    echo ""
    read -rp "Selecciona una opcion [1/2]: " CLEAN_CHOICE

    case "$CLEAN_CHOICE" in
        1)
            step "Deteniendo y eliminando contenedores existentes..."
            $COMPOSE_CMD down --volumes --remove-orphans 2>/dev/null || true
            success "Contenedores detenidos y eliminados."

            step "Eliminando imagenes del proyecto..."
            docker images --filter "reference=*lenguas*" -q | xargs -r docker rmi -f 2>/dev/null || true
            # Eliminar por nombre de compose project
            PROJECT_NAME=$(basename "$(pwd)" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]-_')
            docker images | grep "$PROJECT_NAME" | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
            success "Imagenes eliminadas."
            ;;
        2)
            info "Operacion cancelada por el usuario."
            exit 0
            ;;
        *)
            error "Opción inválida."
            exit 1
            ;;
    esac
else
    success "No se encontraron recursos Docker previos. Instalacion limpia."
fi

# =============================================================================
# PASO 4: Crear / actualizar archivo .env raiz
# =============================================================================
step "Configurando archivo .env raiz..."

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
    # Actualizar HOST_IP si ya existe
    if grep -q "^HOST_IP=" "$ENV_FILE"; then
        sed -i "s|^HOST_IP=.*|HOST_IP=${HOST_IP}|" "$ENV_FILE"
        info "HOST_IP actualizado en .env existente."
    else
        echo "HOST_IP=${HOST_IP}" >> "$ENV_FILE"
        info "HOST_IP agregado al .env existente."
    fi
else
    # Crear desde .env.example o desde cero
    if [ -f ".env.example" ]; then
        cp ".env.example" "$ENV_FILE"
        sed -i "s|^HOST_IP=.*|HOST_IP=${HOST_IP}|" "$ENV_FILE"
        info ".env creado desde .env.example"
    else
        echo "HOST_IP=${HOST_IP}" > "$ENV_FILE"
        info ".env creado con HOST_IP=${HOST_IP}"
    fi
fi

success ".env configurado con HOST_IP=${HOST_IP}"

# =============================================================================
# PASO 5: Build de imagenes Docker
# =============================================================================
step "Construyendo imagenes Docker (esto puede tomar varios minutos)..."
divider
info "Ejecutando: $COMPOSE_CMD build --no-cache"
divider

$COMPOSE_CMD build --no-cache --progress=plain

divider
success "Build completado exitosamente."

# =============================================================================
# PASO 6: Levantar los servicios
# =============================================================================
step "Levantando servicios Docker..."

$COMPOSE_CMD up -d

success "Servicios iniciados en modo detach."

# =============================================================================
# PASO 7: Verificacion del estado
# =============================================================================
step "Verificando estado de los contenedores..."

# Esperar unos segundos para que los contenedores inicien
echo ""
info "Esperando 5 segundos para que los servicios inicien..."
sleep 5

echo ""
$COMPOSE_CMD ps

# =============================================================================
# PASO 8: Resumen final
# =============================================================================
divider
echo ""
echo -e "${BOLD}${GREEN}  ✓ Despliegue completado exitosamente!${NC}"
echo ""
echo -e "  ${BOLD}URL de acceso:${NC}"
echo -e "    Frontend : ${CYAN}http://${HOST_IP}${NC}"
echo -e "    API Test : ${CYAN}http://${HOST_IP}/sanctum/csrf-cookie${NC}"
echo ""
echo -e "  ${BOLD}Comandos utiles:${NC}"
echo -e "    Ver logs en vivo  : ${YELLOW}$COMPOSE_CMD logs -f${NC}"
echo -e "    Ver logs backend  : ${YELLOW}$COMPOSE_CMD logs -f backend${NC}"
echo -e "    Ver logs nginx    : ${YELLOW}$COMPOSE_CMD logs -f nginx${NC}"
echo -e "    Detener servicios : ${YELLOW}$COMPOSE_CMD down${NC}"
echo ""
divider
