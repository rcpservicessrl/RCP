@echo off
chcp 65001 >nul
:: ==============================================================================
:: LANZADOR OBSIDIAN + CAPA NEURONAL v2 — RCP Services Sitio Web
:: 1. Mantenimiento del vault grande (maintenance.py)
:: 2. Sync del knowledge graph (graphify sync)
:: 3. Apertura de Obsidian
:: ==============================================================================
setlocal
set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo [NEURAL] 1/3 Mantenimiento del vault (%ROOT%)...
python "%ROOT%\.neural_bridge\maintenance.py" --vault "%ROOT%"

echo [NEURAL] 2/3 Sync Graphify...
where graphify >nul 2>nul
if %errorlevel%==0 (
    graphify sync --root "%ROOT%" || echo [NEURAL] graphify sync omitido.
) else (
    echo [NEURAL] Graphify no instalado: omitiendo sync.
)

echo [NEURAL] 3/3 Abriendo Obsidian...
if exist "C:\Program Files\Obsidian\Obsidian.exe" (
    start "" "C:\Program Files\Obsidian\Obsidian.exe" "obsidian://open?path=%ROOT%"
) else (
    start "" "obsidian://open?path=%ROOT%"
)
endlocal
exit
