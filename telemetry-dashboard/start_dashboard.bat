@echo off
:: Antigravity Telemetry Dashboard Startup Script
:: This script will start the Next.js Telemetry server in the background on port 9999

cd /d "%~dp0"
echo Starting Antigravity Telemetry Dashboard...

:: Start the Next.js production server hidden in the background
start /B "AntigravityTelemetry" cmd /c "pnpm start -p 9999"

echo Dashboard is running at http://localhost:9999
exit
