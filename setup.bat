@echo off
echo Installing Node.js and NPM...

:: download and install Node.js
curl -sL https://nodejs.org/dist/latest/node.exe -o node.exe
.\node.exe /ver > nul 2>&1
if %errorlevel% neq 0 (
    echo Failed to download Node.js. Please check your internet connection and try again.
    pause
    exit /b
)

:: install dependencies with NPM
echo Installing dependencies with NPM...
.\node.exe node_modules/npm/bin/npm-cli.js install
if %errorlevel% neq 0 (
    echo Failed to install dependencies with NPM. Please check your internet connection and try again.
    pause
    exit /b
)

echo Installation complete.
echo Your application is ready to run!

echo Running your application...
start cmd /c "node index.js"

echo You can also run your application with the "run-app.bat" command.
echo Creating the "run-app.bat" file...
echo node index.js > run-app.bat

echo The "run-app.bat" file has been created successfully!
pause
