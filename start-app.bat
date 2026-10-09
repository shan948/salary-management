@echo off
echo ===================================================================
echo   ACME Organization: Employee Salary Management System (10k scale)
echo ===================================================================
echo Starting Spring Boot Backend (Port 8080) and React UI (Port 5173)...
echo.

set "JAVA_HOME=C:\Users\User\tools\jdk21"
set "MAVEN_HOME=C:\Users\User\tools\maven"
set "PATH=C:\Users\User\tools\mingit\cmd;C:\Users\User\tools\node;C:\Users\User\tools\jdk21\bin;C:\Users\User\tools\maven\bin;%PATH%"

start "ACME Backend (Spring Boot)" cmd /k "cd backend && mvn spring-boot:run"
timeout /t 5 /nobreak >nul
start "ACME Frontend (React)" cmd /k "cd frontend && npm run dev"

echo.
echo Servers launched!
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://localhost:8080/api/analytics/dashboard
echo - H2 Console:  http://localhost:8080/h2-console
echo.
pause
