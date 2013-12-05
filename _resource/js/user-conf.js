/**
 * 注意：
 * 用户配置文件，设置后最好存个本地备份，否则每次更新后就要重新填了！
 * 所有路径须填写绝对路径。
 */

namespace('appConf');

var appConf = {
    userName: 'HowardChen', //留下大名，只可用【字母、数字及下划线】做为默认包名后缀及专题目录后缀后缀，
    codePath: 'E:\\',//代码目录'E:\\DevSimplify\\rs', //
    pkgPath: 'E:\\Mew\\testPath\\package', //打包目录，此目录在程序运行前必须存在，系统不会自动生成!
    zipPath: 'E:\\Mew\\testPath\\zip'//压缩文件生成目录
};

/**
 * 配置服务器路径
 */
appConf.serverList = {
    'server2': {
        name: '2号服务器',
        URL: 'E:\\Mew\\testPath\\server2'
    },
    'server1': {
        name: '1号服务器',
        URL: 'E:\\Mew\\testPath\\server1'
    }
};

//指定默认服务器目录
appConf.uploadServer = appConf.serverList.server1;





