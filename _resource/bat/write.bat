cd /d %~dp0
echo %1
echo %2

set FILEPATH=%1
set CONTENTS=%2

grunt writeFile:%FILEPATH%:%CONTENTS%

echo "write complete!"

pause