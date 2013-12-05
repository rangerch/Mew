cd /d %~dp0
::echo %1

grunt clean:deletePackage --force > output.txt

echo "deletePackage complete!"

pause