# =============================================================================
#  build.ps1 - Script de despliegue para Sistema Integral de Lenguas Extranjeras
#  Uso: .\build.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

# --- Funciones de log ---
function Write-Info($msg) { Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Write-Success($msg) { Write-Host "[OK]    $msg" -ForegroundColor Green }
function Write-WarningMsg($msg) { Write-Host "[WARN]  $msg" -ForegroundColor Yellow }
function Write-ErrorMsg($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red }
function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan -NoNewline; Write-Host "" }
function Write-Divider() { Write-Host "--------------------------------------------------------------" -ForegroundColor Cyan }

# =============================================================================
# PASO 0: Bienvenida
# =============================================================================
Clear-Host
Write-Host "  +---------------------------------------------------------+" -ForegroundColor Cyan
Write-Host "  |   Sistema Integral de Lenguas Extranjeras               |" -ForegroundColor Cyan
Write-Host "  |   Script de despliegue Docker (PowerShell)              |" -ForegroundColor Cyan
Write-Host "  +---------------------------------------------------------+" -ForegroundColor Cyan
Write-Divider

# =============================================================================
# PASO 1: Verificar dependencias necesarias
# =============================================================================
Write-Step "Verificando dependencias del sistema..."

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-ErrorMsg "No se encontro 'docker'. Instalalo antes de continuar."
    exit 1
}
$dockerVersion = (docker --version)
Write-Success "'docker' encontrado: $dockerVersion"

$composeCmd = ""
$composeCheck = docker compose version 2>$null
if ($LASTEXITCODE -eq 0 -or $composeCheck) {
    $composeCmd = "docker compose"
    Write-Success "Docker Compose (plugin v2) encontrado"
} elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    $composeCmd = "docker-compose"
    Write-Success "Docker Compose (standalone v1) encontrado"
} else {
    Write-ErrorMsg "No se encontro 'docker compose' ni 'docker-compose'. Instalalo antes de continuar."
    exit 1
}

# =============================================================================
# PASO 2: Detectar IP del sistema
# =============================================================================
Write-Step "Detectando IP de red local..."

# Filtrar adaptadores virtuales/VPN y ordenar priorizando Ethernet y Wi-Fi fisicos
$physicalAdapters = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
        $_.InterfaceAlias -notmatch "Loopback|vEthernet|VMware|VirtualBox|Hyper-V|WSL|docker|vpn|tap|tun|Pseudo|isatap" -and
        $_.IPAddress -notmatch "^169\.254\." -and
        $_.IPAddress -notmatch "^127\."
    } |
    Sort-Object { if ($_.InterfaceAlias -match "Ethernet|Wi-Fi|WLAN|Wireless") { 0 } else { 1 } }

if ($physicalAdapters) {
    Write-Success "Se encontraron $(@($physicalAdapters).Count) adaptador(es) de red fisico(s)."
} else {
    Write-WarningMsg "No se encontraron adaptadores de red fisicos. Se mostrara solo la opcion localhost."
}

Write-Host ""
Write-Host "Selecciona la IP para el despliegue:" -ForegroundColor Yellow

$menuIndex = 1
$ipList = @()
foreach ($adapter in @($physicalAdapters)) {
    Write-Host "  $menuIndex) [$($adapter.InterfaceAlias)]  " -NoNewline
    Write-Host $adapter.IPAddress -ForegroundColor White
    $ipList += $adapter.IPAddress
    $menuIndex++
}

$localhostIndex = $menuIndex
$manualIndex    = $menuIndex + 1
Write-Host "  $localhostIndex) localhost  (solo acceso desde esta maquina)"
Write-Host "  $manualIndex) Ingresar otra IP manualmente"
Write-Host ""

$ipChoice = Read-Host "Selecciona una opcion [1-$manualIndex]"

$HostIP = ""
if ($ipChoice -match "^\d+$") {
    $choiceNum = [int]$ipChoice
    if ($choiceNum -ge 1 -and $choiceNum -le $ipList.Count) {
        $HostIP = $ipList[$choiceNum - 1]
    } elseif ($choiceNum -eq $localhostIndex) {
        $HostIP = "localhost"
    } elseif ($choiceNum -eq $manualIndex) {
        $HostIP = Read-Host "Ingresa la IP que deseas usar"
        if ($HostIP -notmatch "^localhost$" -and $HostIP -notmatch "^([0-9]{1,3}\.){3}[0-9]{1,3}$") {
            Write-ErrorMsg "Formato de IP invalido: '$HostIP'"
            exit 1
        }
    } else {
        Write-ErrorMsg "Opcion invalida."
        exit 1
    }
} else {
    Write-ErrorMsg "Opcion invalida."
    exit 1
}

Write-Success "Se usara la IP: $HostIP"

if ($HostIP -ne "localhost") {
    Write-Host ""
    Write-Host "  AVISO IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "  La IP $HostIP quedara fija en la configuracion de Docker." -ForegroundColor Yellow
    Write-Host "  Si cambias de red (ej. de Wi-Fi a Ethernet o viceversa)" -ForegroundColor Yellow
    Write-Host "  tu IP cambiara y la app dejara de funcionar desde otros" -ForegroundColor Yellow
    Write-Host "  dispositivos hasta que vuelvas a ejecutar .\\build.ps1" -ForegroundColor Yellow
    Write-Host "  con la nueva IP." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Redes tipicas:" -ForegroundColor DarkYellow
    Write-Host "    Wi-Fi   -> 192.168.X.X  (asignada por el router Wi-Fi)" -ForegroundColor DarkYellow
    Write-Host "    Ethernet -> 192.168.X.X  (asignada por el router/switch)" -ForegroundColor DarkYellow
    Write-Host "  Al cambiar de adaptador, ejecuta nuevamente: .\\build.ps1" -ForegroundColor DarkYellow
    Write-Host ""
}

# =============================================================================
# PASO 3: Verificar imagenes/contenedores existentes
# =============================================================================
Write-Step "Verificando estado actual de Docker..."

$existingContainers = docker ps -a --filter "name=lenguas_" --format "{{.Names}}"
$existingImages = docker images --filter "reference=*lenguas*" --format "{{.Repository}}:{{.Tag}}"

if ($existingContainers -or $existingImages) {
    Write-WarningMsg "Se encontraron recursos Docker existentes:"
    
    if ($existingContainers) {
        Write-Host "  Contenedores:" -ForegroundColor Yellow
        $existingContainers -split "`n" | ForEach-Object { if ($_.Trim()) { Write-Host "    - $_" } }
    }
    
    if ($existingImages) {
        Write-Host "  Imagenes:" -ForegroundColor Yellow
        $existingImages -split "`n" | ForEach-Object { if ($_.Trim()) { Write-Host "    - $_" } }
    }
    
    Write-Host ""
    Write-Host "Que deseas hacer?" -ForegroundColor Yellow
    Write-Host "  1) Limpiar todo e instalar en limpio (recomendado)"
    Write-Host "  2) Cancelar"
    Write-Host ""
    
    $cleanChoice = Read-Host "Selecciona una opcion [1/2]"
    
    switch ($cleanChoice) {
        "1" {
            Write-Step "Deteniendo y eliminando contenedores existentes..."
            Invoke-Expression ($composeCmd + " down --volumes --remove-orphans")
            Write-Success "Contenedores detenidos y eliminados."
            
            Write-Step "Eliminando imagenes del proyecto..."
            $imagesToRemove = docker images --filter "reference=*lenguas*" -q
            if ($imagesToRemove) {
                $imagesToRemove -split "`n" | Select-Object -Unique | ForEach-Object { docker rmi -f $_ }
            }
            $projectName = (Get-Item .).Name.ToLower() -replace '[^a-z0-9\-_]',''
            $projectImages = docker images | Select-String $projectName | ForEach-Object { ($_ -split '\s+')[2] }
            if ($projectImages) {
                $projectImages | Select-Object -Unique | ForEach-Object { docker rmi -f $_ }
            }
            Write-Success "Imagenes eliminadas."
        }
        "2" {
            Write-Info "Operacion cancelada por el usuario."
            exit 0
        }
        default {
            Write-ErrorMsg "Opcion invalida."
            exit 1
        }
    }
} else {
    Write-Success "No se encontraron recursos Docker previos. Instalacion limpia."
}

# =============================================================================
# PASO 4: Crear / actualizar archivo .env raiz
# =============================================================================
Write-Step "Configurando archivo .env raiz..."

$envFile = ".env"

if (Test-Path $envFile) {
    if ((Select-String -Path $envFile -Pattern "^HOST_IP=") -ne $null) {
        (Get-Content $envFile) -replace "^HOST_IP=.*", "HOST_IP=$HostIP" | Set-Content $envFile
        Write-Info "HOST_IP actualizado en .env existente."
    } else {
        Add-Content $envFile "HOST_IP=$HostIP"
        Write-Info "HOST_IP agregado al .env existente."
    }
} else {
    if (Test-Path ".env.example") {
        Copy-Item -Path ".env.example" -Destination $envFile
        (Get-Content $envFile) -replace "^HOST_IP=.*", "HOST_IP=$HostIP" | Set-Content $envFile
        Write-Info ".env creado desde .env.example"
    } else {
        Set-Content -Path $envFile -Value "HOST_IP=$HostIP"
        Write-Info ".env creado con HOST_IP=$HostIP"
    }
}

Write-Success ".env configurado con HOST_IP=$HostIP"

# =============================================================================
# PASO 4.5: Configurar line endings para sh
# =============================================================================
Write-Step "Verificando formato de salto de linea en scripts de shell..."
$entrypointPath = "docker/backend/entrypoint.sh"
if (Test-Path $entrypointPath) {
    $content = Get-Content $entrypointPath -Raw
    if ($content -match "`r`n") {
        Write-Info "Convirtiendo CRLF a LF en $entrypointPath..."
        $content = $content -replace "`r`n", "`n"
        [System.IO.File]::WriteAllText("$PWD/$entrypointPath", $content, [System.Text.UTF8Encoding]::new($false))
        Write-Success "Line endings convertidos."
    } else {
        Write-Info "Line endings ya estaban en formato Unix (LF)."
    }
}

# =============================================================================
# PASO 5: Build de imagenes Docker
# =============================================================================
Write-Step "Construyendo imagenes Docker (esto puede tomar varios minutos)..."
Write-Divider
Write-Info ("Ejecutando: " + $composeCmd + " build --no-cache")
Write-Divider

cmd /c ($composeCmd + " build --no-cache --progress=plain")

Write-Divider
Write-Success "Build completado exitosamente."

# =============================================================================
# PASO 6: Levantar los servicios
# =============================================================================
Write-Step "Levantando servicios Docker..."

cmd /c ($composeCmd + " up -d")

Write-Success "Servicios iniciados en modo detach."

# =============================================================================
# PASO 7: Verificacion del estado
# =============================================================================
Write-Step "Verificando estado de los contenedores..."

Write-Host ""
Write-Info "Esperando 5 segundos para que los servicios inicien..."
Start-Sleep -Seconds 5

Write-Host ""
cmd /c ($composeCmd + " ps")

# =============================================================================
# PASO 8: Resumen final
# =============================================================================
Write-Divider
Write-Host ""
Write-Host "  Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host ""

Write-Host "  URL de acceso:" -ForegroundColor White
Write-Host "    Frontend : " -NoNewline; Write-Host "http://$HostIP" -ForegroundColor Cyan
Write-Host "    API Test : " -NoNewline; Write-Host "http://$HostIP/sanctum/csrf-cookie" -ForegroundColor Cyan
Write-Host ""

Write-Host "  Comandos utiles:" -ForegroundColor White
Write-Host "    Ver logs en vivo  : " -NoNewline; Write-Host ($composeCmd + " logs -f") -ForegroundColor Yellow
Write-Host "    Ver logs backend  : " -NoNewline; Write-Host ($composeCmd + " logs -f backend") -ForegroundColor Yellow
Write-Host "    Ver logs nginx    : " -NoNewline; Write-Host ($composeCmd + " logs -f nginx") -ForegroundColor Yellow
Write-Host "    Detener servicios : " -NoNewline; Write-Host ($composeCmd + " down") -ForegroundColor Yellow
Write-Host ""
Write-Divider