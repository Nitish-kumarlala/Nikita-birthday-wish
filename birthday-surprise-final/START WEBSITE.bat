@echo off
title Birthday Surprise Website
cd /d "%~dp0"

where py >nul 2>&1
if %errorlevel%==0 (
    set "PYTHON=py"
) else (
    where python >nul 2>&1
    if %errorlevel%==0 (
        set "PYTHON=python"
    ) else (
        echo.
        echo Python is not installed or is not available in PATH.
        echo You can still open index.html directly in your browser.
        echo.
        pause
        exit /b 1
    )
)

echo Starting Birthday Surprise Website...
echo.
echo Opening http://localhost:8080
echo Keep this window open while using the website.
echo Press Ctrl+C here to stop the server.
echo.

start "" /b cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"
%PYTHON% -m http.server 8080
