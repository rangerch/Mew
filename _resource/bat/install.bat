cd /d %~dp0

cd ../../

echo "start install..."

call npm install -g grunt-cli
::call npm install grunt --save-dev

::install plugin.
::call npm install grunt-contrib --save-dev
::call npm install grunt-shell --save-dev
::call npm install grunt-contrib-copy --save-dev
::call npm install grunt-contrib-clean --save-dev
::call npm install grunt-contrib-compress --save-dev
::call npm install grunt-contrib-htmlmin --save-dev
::call npm install grunt-text-replace --save-dev

::call npm install jpegtran-bin@0.2.0
::call npm install grunt-contrib-imagemin --save-dev

::call npm install mkdirp

::install Nodejs module.
::call npm install file-poster

echo install finished！