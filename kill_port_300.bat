REM This script is used to kill any process running on port 3000 and then start the Node.js server. Use it to automatically run the application.

@echo off
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000"') do taskkill /F /PID %%a
node server.js
