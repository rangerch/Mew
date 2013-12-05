cd /d %~dp0
::echo %1

grunt uglify:min > output.txt

echo "jsmin complete!"

pause