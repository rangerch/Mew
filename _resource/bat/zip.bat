cd /d %~dp0
::echo %1

grunt compress:zipPackage > output.txt

echo "zip package created!"

pause