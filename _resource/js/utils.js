/**
 * S_Utils = Utils of Simplify.
 */
namespace('S_Utils');

/*********************************************
 *  Tools about script _shell.
 *********************************************/
S_Utils.scriptShell = {
    _shell: (function () {
        try {
            return new ActiveXObject("WScript.Shell");
        } catch ( e ) {
            console.log('请使用IE浏览器，并允许相应操作');
        }
    })(),
    /**
     * showInExplorer
     * @description Open window explorer according to the gived path.
     * @param path
     */
    showInExplorer: function ( path ) {
        var that = S_Utils.scriptShell,
            path = S_Utils.path.getPath(String(path));

        that._shell.Run(appConf.batPath + "showInExplorer.bat " + path, 0, true);
    },

    /**
     * Unstable!!
     */
    refresh: function ( appName ) {
        var that = this;

        that._shell.AppActivate(appName);
        that._shell.SendKeys('{F5}');
//        that._shell.SendKeys('{^+TAB}');    // Error!

//        WScript.Sleep 500
//        WshShell.SendKeys "{TAB}"
//        WScript.Sleep 100
//        WshShell.SendKeys "{F5}"
    },
    /**
     * Call install.bat
     */
    installApp: function () {
        var that = S_Utils.scriptShell;

        that._shell.Run(appConf.batPath + "install.bat", 9, true);
        that.createShortcut();
        window.location.reload();
    },

    /**
     * create a shortcut at desktop.
     */
    createShortcut: function () {
        var that = this,
            desktop = this._shell.SpecialFolders("Desktop"),
            shortcut = this._shell.CreateShortcut(desktop + "\\" + appConf.appName + ".lnk");

        shortcut.TargetPath = appConf.batPath + "start.bat";
        shortcut.WindowStyle = 9;
        shortcut.Description = "打开Simplify";
        shortcut.WorkingDirectory = appConf.appPath;
        shortcut.IconLocation = appConf.resPath + "images\\t.ico";
        shortcut.Save();
    },

    run: function ( commandStr ) {
        this._shell.Run(commandStr, 0, true);
    },

    /**
     *  @Deprecated 命令行传参长度限制 32767字符！无法处理大的文件列表，改用Wscript.shell处理.
     *  Call write.bat
     * @param path ,encode it first! because activeX plugin can just wirte in ascii or unicode, chinese will show incorrect.
     * @param content ,encode it first!
     */
//    write: function ( path, content ) {
//        try {
//            S_Utils.scriptFSO.write(path, encodeURIComponent(content));
//        } catch ( e ) {
//            alert('写文件错误:' + e);
//        }
//    },

    process: function ( path, content, runOpt ) {
        var that = S_Utils.scriptShell;

        try {
            app.view.appView.trigger('startworking');
            S_Utils.scriptFSO.write(path, encodeURIComponent(content));
//            console.log(content);
            that._shell.Run(runOpt.bat, runOpt.t, runOpt.f);

            if ( window.console ) {
                console.log(S_Utils.scriptFSO.getCMDMsg(appConf.resPath + '\\bat\\output.txt'));
            }
            app.view.appView.trigger('stopworking');
        } catch ( e ) {
            alert(e);
        }
    },

    ztUpload: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.ZTfiles';

        this.process(path, content, {'bat': appConf.batPath + 'ztUpload.bat', 't': 0, 'f': true});
    },

    pack: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.copyfiles';

        this.process(path, content, {'bat': appConf.batPath + 'pack.bat', 't': 0, 'f': true});
    },
    rename: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.renamefiles';

        this.process(path, content, {'bat': appConf.batPath + 'rename.bat', 't': 0, 'f': true});
    },
    upload: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.uploadfiles';

        this.process(path, content, {'bat': appConf.batPath + 'upload.bat', 't': 0, 'f': true});
    },
    zip: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.zipfiles';

        this.process(path, content, {'bat': appConf.batPath + 'zip.bat', 't': 0, 'f': true});
    },
    del: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.deletefiles';

        this.process(path, content, {'bat': appConf.batPath + 'delete.bat', 't': 0, 'f': true});
    },
    jsmin: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.jsminfiles';

        this.process(path, content, {'bat': appConf.batPath + 'jsmin.bat', 't': 0, 'f': true});
    },
    cssmin: function ( content ) {
        var that = S_Utils.scriptShell,
            path = appConf.gruntConfPath + '.cssminfiles';

        this.process(path, content, {'bat': appConf.batPath + 'cssmin.bat', 't': 0, 'f': true});
    }
};

/*********************************************
 *  Tools about FSO.
 *********************************************/
S_Utils.scriptFSO = {
    _fso: (function () {
        try {
            return new ActiveXObject("Scripting.FileSystemObject");
        } catch ( e ) {
            console.log('请使用IE浏览器，并允许相应操作');
        }
    })(),
    write: function ( path, contents ) {
        var f = this._fso.CreateTextFile(path, true);
        f.WriteLine(contents);
        f.Close();
    },
    getFolder: function ( folderspec ) {
        return this._fso.GetFolder(folderspec);
    },
    isFilePath: function ( p ) {
        return this._fso.FileExists(p);
    },
    getFolderObj: function ( folderspec ) {
        return this._fso.GetFolder(folderspec);
    },
    getFileText: function ( path ) {
        var f = this._fso.OpenTextFile(path);
        return f.ReadAll();
    },
    getFile: function ( filePath ) {
        return this._fso.GetFile(filePath);
    },
    //得到控制台输出，并过滤掉乱码
    getCMDMsg: function ( path ) {
        return this.getFileText(path).replace(/\[\d*m/gi, '');
    }
};


/*********************************************
 * Convert a single colored text to a rainbow style.
 *********************************************/
namespace('S_Utils.effect');
S_Utils.effect.rainbow = {
    createRainbowText: function ( str, phase ) {
        var that = this,
            html = '',
            phase = phase,
            center = 128,
            width = 127,
            color = '';

        if ( !phase ) phase = 0;

        frequency = Math.PI * 2 / str.length;

        for ( var i = 0; i < str.length; ++i ) {
            red = Math.sin(frequency * i + 2 + phase) * width + center;
            green = Math.sin(frequency * i + 0 + phase) * width + center;
            blue = Math.sin(frequency * i + 4 + phase) * width + center;
            color = that._RGB2Color(red, green, blue);
            html += '<span style="color:' + color + ';border:1px solid ' + color + ';border-width:0 0 3px;">' + str.substr(i, 1) + '</span>'
        }

        return html;
    },
    _RGB2Color: function ( r, g, b ) {
        return '#' + this._byte2Hex(r) + this._byte2Hex(g) + this._byte2Hex(b);
    },
    _byte2Hex: function ( n ) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }
};


/*********************************************
 * About color.
 *********************************************/
S_Utils.color = {
    /**
     * return a random color.
     */
    randomColor: function () {
        var c = '',
            r = 0;
        for ( var i = 0; i < 3; i++ ) {
            r = Math.floor(Math.random() * 255).toString(16);
            if ( r.length < 2 ) r = '0' + r;
            c += r;
        }
        return '#' + c;
    }
};

/*********************************************
 * Some tools about manipulate the path.
 *********************************************/
S_Utils.path = {
    /**
     * @description return path of the App.
     * @returns {string}
     */
    appPath: window.location.href.replace(/^file:\/\/\/(.*\/)\w*.html$/, "$1"),

    /**
     * @description return a path without filename.
     * @param path may be a pure path or a path with filename.
     * @returns {string}
     */
    getPath: function ( path ) {
        return path.replace(/^(.*)[\/|\\].*\.\w*$/, '$1');
    },

    getFileNameWithoutType: function ( path ) {
        return path.replace(/^.*\\(.*)\.\w*$/, '$1');
    },

    getFileType: function ( path ) {
        return path.replace(/^.*\\.*\.(\w*)$/, '$1');
    }
};


/*********************************************
 * Some tools about Time.
 *********************************************/
S_Utils.time = {
    date: new Date(),
    y: function () {
        return this.date.getFullYear();
    },
    m: function () {
        return this.supplyDigit(this.date.getMonth() + 1);
    },
    d: function () {
        return this.supplyDigit(this.date.getDate());
    },
    hh: function () {
        return this.supplyDigit(this.date.getHours());
    },
    mm: function () {
        return this.supplyDigit(this.date.getMinutes());
    },
    ss: function () {
        return this.supplyDigit(this.date.getSeconds());
    },
    toString: function () {
        return S_Utils.time.date.getTime();
    },
    refresh: function ( timestamp ) {
        this.date = timestamp ? new Date(timestamp) : new Date();
    },
    supplyDigit: function ( v ) {
        return v > 9 ? v.toString() : '0' + v;
    }
};


/**
 *
 * @param rule String
 input -> y:m:d:hh:mm:ss  return: 20131107121259
 input -> hh:mm:ss  return: 121259
 * @param refresh Boolean
 * @returns {string}
 */
S_Utils.time.timestamp = function ( rule, refresh ) {
    var r = rule.split(':'),
        s = '';

    if ( refresh ) S_Utils.time.refresh();

    _.each(r, function ( ele, index, list ) {
        s += S_Utils.time[ele]();
    });
    return s;
};

/**
 * Env
 */
S_Utils.env = {
    isWin64: function () {
        return navigator.userAgent.indexOf('WOW64') > -1 || window.navigator.platform == 'Win64';
    }
};

/**
 * Folder
 */
S_Utils.folder = {
    //获取指定目录列表
    createFolderList: function ( folderspec, checkstate ) {
//            alert('check folder:' + folderspec);
        var f = S_Utils.scriptFSO.getFolder(folderspec);
        var fc = new Enumerator(f.SubFolders);    //Enumerator 兼容性
        var ff = new Enumerator(f.files);
        var arr = [];
        var d = null;

        try {
            // 遍历目录
            for ( ; !fc.atEnd(); fc.moveNext() ) {
                var value = fc.item(),
                    title = value.Name;

                d = new Date(value.dateLastModified);

                arr.push({
                        "id": ("node-" + value).replace(/[^\w]/gi, "_"),
                        "text": title,
                        "value": value,
                        "showcheck": true,
                        complete: true,
                        "isexpand": false,
                        "checkstate": checkstate,
                        "hasChildren": true,
                        "dateModified": '' + (d.getMonth() + 1) + '.' + d.getDate(),
                        "ChildNodes": null //S_Utils.folder.createFolderList(fc.item())  //已改为懒加载
                    }
                )
                ;
            }

            //读取当前目录文件
            for ( ; !ff.atEnd(); ff.moveNext() ) {
                var value = ff.item(),
                    title = value.Name,
                    size = (value.Size / 1024).toFixed(1) + 'K';

                d = new Date(value.dateLastModified);

                arr.push({
                    "id": ("node-" + value).replace(/[^\w]/gi, "_"),
                    "text": title,
                    "value": value,
                    "showcheck": true,
                    complete: true,
                    "isexpand": false,
                    "checkstate": checkstate,
                    "dateModified": (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes(),
                    "size": '' + size,
                    "hasChildren": false
                });
            }

        } catch ( e ) {
            alert(e)
        }
        return arr;
    },

//遍历目录及子目录内所有文件路径
    getAllFilesArr: function ( folderspec, arr ) {
//        alert(folderspec);
        var f = S_Utils.scriptFSO.getFolder(folderspec),
            fc = new Enumerator(f.SubFolders),    //Enumerator 兼容性
            ff = new Enumerator(f.files),
            arr = arr ? arr : [];//首次递归时创建数组

        //读取当前目录文件
        for ( ; !ff.atEnd(); ff.moveNext() ) {
            arr.push(ff.item().Path);
        }

        // 遍历目录
        for ( ; !fc.atEnd(); fc.moveNext() ) {
            S_Utils.folder.getAllFilesArr(fc.item().Path, arr);
        }
        return arr;
    },

//从多个目录（可能层叠）筛选出目录内所有的文件
    getUniqueFilesArr: function ( paths ) {
        var path = '',
            checkedPath = [],
            checked = false,
            arr = [];

        for ( var i = 0, len = paths.length; i < len; i++ ) {
            path = String(paths[i]);

            //过滤已递归路径
            if ( checkedPath.length ) {
                for ( var k in checkedPath ) {
//                    console.log('checkedPath:' +  checkedPath + " --> " + path);
                    if ( path.indexOf(checkedPath[k]) != -1 ) {
                        checked = true;
                        break;
                    }
                }
                if ( checked ) {
                    checked = false;
                    continue;
                }
            }

            //recursive
            if ( !S_Utils.scriptFSO.isFilePath(path) ) {
                arr = arr.concat(S_Utils.folder.getAllFilesArr(path));
            } else {
                arr.push(path);
            }

            checkedPath.push(path);
        }
        return arr;
    },

    /**
     * 获取所有选中文件包含文件信息组成的数组
     *
     * @param paths {Array} 需要获取信息的目录或文件
     */
    getUniqueFilesArrWithInfo: function ( paths ) {
        var files = S_Utils.folder.getUniqueFilesArr(paths),
            file = null,
            fileObj = {},
            filesInfoArr = [];

        for ( var i = 0, length = files.length; i < length; i++ ) {
            file = S_Utils.scriptFSO.getFile(files[i]);
            filesInfoArr.push(file);
        }
        return filesInfoArr;
    }
}
;


S_Utils.string = {
    /**
     * 连接字符串，排除头尾重复的部分.
     *
     * @param a {String}
     * @param b {String}
     *
     * @example
     *      uniConcat('what a beautiful', 'beautiful world.');
     *      return 'what a beautiful world.'
     */
    uniConcat: function ( a, b ) {
        var r = '',
            ra = '',
            rb = '';

        for ( var i = 0; i < a.length; i++ ) {
            ra = a.substr(a.length - i);
            rb = b.substring(0, i);
            if ( ra == rb ) {
                r = rb;
            }
        }

        return a + b.substr(r.length);
    }
};

/**
 * 日志
 *
 * 开启debug，使URL: url#debug=1
 */
S_Utils.debug = {
    isDebug: location.hash.indexOf('debug=1') != -1,
    LEVEL: {
        ERROR: 1,
        WARN: 2,
        DEBUG: 3,
        INFO: 4
    },
    log: function ( msg, level ) {
        var that = this;

        if ( window.console ) {
            if ( !that.isDebug && level <= that.LEVEL.DEBUG ) {
                return;
            }
            console.log(msg);
        }
    }
};

/*********************************************
 * Create Namespace
 *********************************************/
function namespace( nameSpace, noCheckName ) {
    nameSpace = (nameSpace || '').split(/\s*\.\s*/g);

    var m = window, d, ns;
    for ( var i = 0, l = nameSpace.length; i < l; i++ ) {
        ns = nameSpace[i];

        if ( d ) d += '.' + ns;
        else d = ns;

        if ( !m[ns] ) m[ns] = {};
        if ( noCheckName !== true && !m[ns].$name ) m[ns].$name = d;

        m = m[ns];
    }
    return m;
};


