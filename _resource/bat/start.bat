set DIR=%~dp0../../
set PAGE=index.html
set URL=%DIR%%PAGE%
::echo %URL%

start "IE" iexplore  %URL%