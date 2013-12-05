cd /d %~dp0
::echo %1

grunt cssmin:min > output.txt

echo "cssmin complete!"

pause