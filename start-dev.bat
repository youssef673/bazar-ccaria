@echo off
cd /d "%~dp0"
echo Avvio Bazar su http://localhost:3000 ...
echo.
if not exist "node_modules\" (
  echo Installazione dipendenze...
  "C:\Program Files\nodejs\npm.cmd" install
)
if not exist "prisma\dev.db" (
  echo Creazione database...
  "C:\Program Files\nodejs\npm.cmd" run db:push
  "C:\Program Files\nodejs\npm.cmd" run db:seed
)
"C:\Program Files\nodejs\npm.cmd" run dev
pause
