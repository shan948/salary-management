# PowerShell startup script for ACME Salary Management System
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  ACME Organization: Employee Salary Management System (10k scale)" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Users\User\tools\jdk21"
$env:MAVEN_HOME = "C:\Users\User\tools\maven"
$env:Path = "C:\Users\User\tools\mingit\cmd;C:\Users\User\tools\node;C:\Users\User\tools\jdk21\bin;C:\Users\User\tools\maven\bin;" + $env:Path

Write-Host "Starting Spring Boot Backend on http://localhost:8080 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:JAVA_HOME='C:\Users\User\tools\jdk21'; `$env:Path='C:\Users\User\tools\jdk21\bin;C:\Users\User\tools\maven\bin;' + `$env:Path; Set-Location '$PSScriptRoot\backend'; mvn spring-boot:run"

Start-Sleep -Seconds 5

Write-Host "Starting React Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path='C:\Users\User\tools\node;' + `$env:Path; Set-Location '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`nApplications successfully started!" -ForegroundColor Yellow
Write-Host "- React UI:    http://localhost:5173"
Write-Host "- Backend API: http://localhost:8080/api/analytics/dashboard"
Write-Host "- H2 Database: http://localhost:8080/h2-console"
