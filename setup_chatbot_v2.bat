@echo off
rem -------------------------------------------------
rem  setup_chatbot_v2.bat  –  despliegue completo + gestión de Node
rem -------------------------------------------------
rem  Requisitos previos: PowerShell, conexión a internet
rem -------------------------------------------------

rem ==== 1. Instalar nvm‑windows (si no está) ====
where nvm >nul 2>&1
if errorlevel 1 (
    echo Instalando nvm‑windows...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.zip' -OutFile 'nvm-setup.zip'"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path 'nvm-setup.zip' -DestinationPath '.' -Force"
    start /wait "" nvm-setup.exe
    del nvm-setup.zip
)

rem ==== 2. Instalar y usar Node 22 (compatible) ====
echo Instalando Node 22...
nvm install 22.0.0
nvm use 22.0.0
rem Verificar
node -v
if not "%errorlevel%"=="0" (
    echo ERROR: No se pudo cambiar a Node 22.
    pause
    exit /b 1
)

rem ==== 3. Instalar firebase‑tools con la versión correcta de Node ====
echo Instalando firebase-tools...
"C:\Program Files\nodejs\npm.cmd" install -g firebase-tools
if errorlevel 1 (
    echo ERROR: firebase-tools no se instaló.
    pause
    exit /b 1
)

rem ==== 4. Descomprimir Google Cloud SDK (el zip ya está en la carpeta) ====
if not exist "google-cloud-sdk.zip" (
    echo ERROR: google-cloud-sdk.zip no encontrado. Descárguelo nuevamente.
    pause
    exit /b 1
)
echo Extrayendo SDK…
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path 'google-cloud-sdk.zip' -DestinationPath '.' -Force"
if errorlevel 1 (
    echo ERROR: No se pudo descomprimir el SDK.
    pause
    exit /b 1
)

rem ==== 5. Instalar SDK (modo silencioso) ====
call google-cloud-sdk\install.bat --quiet
if errorlevel 1 (
    echo ERROR: La instalación del SDK falló.
    pause
    exit /b 1
)

rem ==== 6. Añadir gcloud al PATH para esta sesión ====
set "PATH=%CD%\google-cloud-sdk\bin;%PATH%"

rem ==== 7. Autenticación en Google Cloud ====
echo Autenticándose en Google Cloud…
gcloud auth login
if errorlevel 1 (
    echo ERROR: Autenticación falló.
    pause
    exit /b 1
)

rem ==== 8. Seleccionar proyecto ====
set "PROJECT_ID=chatbot-rcp"
gcloud config set project %PROJECT_ID%
if errorlevel 1 (
    echo ERROR: No se pudo establecer el proyecto.
    pause
    exit /b 1
)

rem ==== 9. Habilitar APIs necesarias ====
gcloud services enable cloudfunctions.googleapis.com cloudbuild.googleapis.com firebasehosting.googleapis.com
if errorlevel 1 (
    echo ERROR: No se pudieron habilitar las APIs.
    pause
    exit /b 1
)

rem ==== 10. Configurar Firebase ====
firebase login
firebase use --add %PROJECT_ID%
if errorlevel 1 (
    echo ERROR: Configuración de Firebase falló.
    pause
    exit /b 1
)

rem ==== 11. Definir claves API de Gemini para rotación ====
set "GEMINI_API_KEY=AQ.Ab8RN6JnK_YqwUbTGobJfYXO-2Va43A2s3E2NUanNLjM6BgsXA"
set "GEMINI_API_KEY_2=AQ.Ab8RN6L4d2nKvDHPM7NzDEYm0wY5UsbFtZ67PshUa2wD7mqnfA"
set "GEMINI_API_KEY_3=AQ.Ab8RN6KO-pnTn7f_IrL2FWO1HPKet-Q4lIHGY-GddAZ4uhabYQ"

rem ==== 12. Desplegar la Cloud Function ====
echo Desplegando Cloud Function…
gcloud functions deploy rcpChat ^
    --runtime python311 ^
    --trigger-http ^
    --allow-unauthenticated ^
    --set-env-vars GEMINI_API_KEY=%GEMINI_API_KEY%,GEMINI_API_KEY_2=%GEMINI_API_KEY_2%,GEMINI_API_KEY_3=%GEMINI_API_KEY_3% ^
    --region us-central1 ^
    --source ./cloud_function
if errorlevel 1 (
    echo ERROR: El despliegue de la función falló.
    pause
    exit /b 1
)

rem ==== 13. Obtener la URL del endpoint y actualizar script.js ====
for /f "usebackq delims=" %%U in (`gcloud functions describe rcpChat ^
    --region us-central1 ^
    --format "value(httpsTrigger.url)"`) do set "FUNCTION_URL=%%U"

echo.
echo URL de la Cloud Function: %FUNCTION_URL%
echo Actualizando script.js…
powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Content -Path 'script.js') -replace 'https://.*\.cloudfunctions\.net/.*', '%FUNCTION_URL%' | Set-Content -Path 'script.js'"

rem ==== 14. (Opcional) Deploy de Firebase Hosting ====
set /p DEPLOY_HOSTING=¿Desea desplegar el sitio con Firebase Hosting? (s/n): 
if /I "%DEPLOY_HOSTING%"=="s" (
    echo Inicializando Hosting (si ya existe, se omite)…
    firebase init hosting -y
    rem Copiar script.js al folder de hosting (public)
    if not exist public mkdir public
    copy /Y "script.js" "public\script.js"
    firebase deploy --only hosting
)

rem ==== 15. Finalizado ====
echo.
echo ================================
echo  ✅  Todo listo!
echo  - Cloud Function activa en: %FUNCTION_URL%
echo  - script.js actualizado
echo  - (Opcional) sitio publicado en Firebase Hosting
echo ================================
pause
