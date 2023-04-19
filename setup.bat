@echo off
echo Checking for Node.js on your system...
where node >nul 2>&1 || (
    echo Node.js is not installed on your system.
    echo Please install Node.js before continuing.
    pause
    exit /b
)

echo Node.js is installed on your system.
echo Installing dependencies with NPM...
npm install >nul 2>&1 || (
    echo Installation failed. Please check your internet connection and try again.
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
