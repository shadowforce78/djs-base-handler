@echo off
echo Vérification de la présence de Node.js sur votre système...
where node >nul 2>&1 || (
    echo Node.js n'est pas installé sur votre système.
    echo Veuillez installer Node.js avant de continuer.
    pause
    exit /b
)

echo Node.js est installé sur votre système.
echo Installation de dépendances avec NPM...
npm install >nul 2>&1 || (
    echo L'installation a échoué. Veuillez vérifier votre connexion internet et réessayer.
    pause
    exit /b
)

echo Installation terminée. 
echo Votre application est prête à être lancée!
pause
