/**
 * Config by app.
 */
namespace('appConf');

appConf.appName = 'Mew';
appConf.ver = '0.0.1 dev';
appConf.buildDate = '2013/12/4';
appConf.appPath = S_Utils.path.appPath;
appConf.resPath = appConf.appPath + '_resource/';//资源文件文件夹
appConf.batPath = appConf.resPath + 'bat/';//批处理脚本
appConf.gruntConfPath = appConf.appPath + '_resource/gruntConf/';//grunt参数文件
appConf.defaultPackageNameRule = function () {
    return S_Utils.time.timestamp('y:m:d:hh:mm', true) + '-' + appConf.userName;
};

appConf.uploadAlertCount = 20; //上传文件数超出此数值时弹出警告。

appConf.ztUploadCallbackInfoFilePath = appConf.appPath + '_resource/data/.ztUploadCallbackInfo'; //grunt写，app读


// When rending an underscore template, we want top-level
// variables to be referenced as part of an object. For
// technical reasons (scope-chain search), this speeds up
// rendering; however, more importantly, this also allows our
// templates to look / feel more like our server-side
// templates that use the rc (Request Context / Colletion) in
// order to render their markup.
_.templateSettings.variable = "rc"; //设置模板顶级变量


