@echo off
cd /d "%~dp0"
rem Starts the site and opens it in your browser once it is ready. Keep this window open while you use it.
node serve.js --open
pause
