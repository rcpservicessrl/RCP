@echo off
rem =============================================================
rem  Setup script for RCP Chatbot – zero‑cost permanent webhook
rem  ------------------------------------------------------------
rem  Prerequisitos: Node (v20+), npm, PowerShell (ExecutionPolicy Bypass)
rem               Conexión a internet
rem  ------------------------------------------------------------

rem ==== 1. Instalar Firebase CLI ==== 
"C:\Program Files\nodejs\npm.cmd" install -g firebase-tools
if %errorlevel% neq 0 (
  echo ERROR: No se pudo instalar firebase-tools
  exit /b 1
)

rem ==== 2. Descargar Google Cloud SDK ==== 
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-469.0.0-windows-x86_64.zip' -OutFile 'google-cloud-sdk.zip'"
if %errorlevel% neq 0 (
  echo ERROR: No se pudo descargar el SDK de Google Cloud
  exit /b 1
)

rem ==== 3. Extraer SDK ==== 
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path 'google-cloud-sdk.zip' -DestinationPath '.' -Force"
if %errorlevel% neq 0 (
  echo ERROR: No se pudo descomprimir el SDK
  exit /b 1
)

rem ==== 4. Instalar SDK (modo silencioso) ==== 
call google-cloud-sdk\install.bat --quiet
if %errorlevel% neq 0 (
  echo ERROR: La instalación del SDK falló
  exit /b 1
)

rem ==== 5. Añadir gcloud al PATH para esta sesión ==== 
set PATH=%CD%\google-cloud-sdk\bin;%PATH%

rem ==== 6. Autenticación en Google Cloud ==== 
rem  Se abrirá una ventana del navegador; siga las instrucciones.
"gcloud" auth login
if %errorlevel% neq 0 (
  echo ERROR: Autenticación falló
  exit /b 1
)

rem ==== 7. Seleccionar proyecto ==== 
set PROJECT_ID=chatbot-rcp
"gcloud" config set project %PROJECT_ID%

rem ==== 8. Habilitar APIs necesarias ==== 
"gcloud" services enable cloudfunctions.googleapis.com cloudbuild.googleapis.com firebasehosting.googleapis.com

rem ==== 9. Configurar Firebase ==== 
firebase login
firebase use --add %PROJECT_ID%

rem ==== 10. Preparar la Cloud Function ==== 
rem  Los archivos main.py y requirements.txt ya están en la carpeta cloud_function

rem ==== 11. Definir clave API de Gemini (reemplazar por su propia clave) ==== 
set GEMINI_API_KEY=AQ.Ab8RN6JPIHEhVy-GO6mk-edr60uoDZyzAjWy_-KWIcouF2mYDA

rem ==== 12. Desplegar la Cloud Function ==== 
"gcloud" functions deploy rcpChat ^
    --runtime python311 ^
    --trigger-http ^
    --allow-unauthenticated ^
    --set-env-vars GEMINI_API_KEY=%GEMINI_API_KEY% ^
    --region us-central1 ^
    --source ./cloud_function

if %errorlevel% neq 0 (
  echo ERROR: El despliegue de la Cloud Function falló
  exit /b 1
)

rem ==== 13. Capturar la URL del endpoint ==== 
for /f "tokens=1* delims= " %%A in ('gcloud functions describe rcpChat --region us-central1 --format "value(httpsTrigger.url)"') do set FUNCTION_URL=%%A

echo.
echo URL de la Cloud Function: %FUNCTION_URL%

rem ==== 14. Actualizar script.js ==== 
rem  Reemplaza la línea que contiene RCP_CHATBOT_WEBHOOK_URL con la nueva URL
powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Content -Path 'script.js') -replace "https://.*\.cloudfunctions\.net/.*", "%FUNCTION_URL%" | Set-Content -Path 'script.js'"

rem ==== 15. (Opcional) Deploy de Firebase Hosting ==== 
set /p DEPLOY_HOSTING=¿Desea desplegar el sitio con Firebase Hosting? (s/n): 
if /I "%DEPLOY_HOSTING%"=="s" (
  firebase init hosting -y
  copy /Y "script.js" "public\script.js"
  firebase deploy --only hosting
)

rem ==== 16. Finalizado ==== 
echo.
echo ==== Configuración completada ==== 
 echo Visite la URL del sitio (si usó Firebase Hosting) o abra su página local y pruebe el chat.
pause
