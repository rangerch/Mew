/**
 * description 打包目录视图 , Singleton
 *
 * @class PackView
 */

namespace('app.view');

(function ( $ ) {
    var treeView = null,
        treeModel = null,
        pkgPathOrigin = '';

    var PackView = Backbone.View.extend({

        el: '#packPart',

        events: {
            'click #showchecked-treepackage': 'showSelectedItems',
            'click #show-packlocal-btn': 'showPacklocalOrigin',
            'click #rename-suffix-btn': 'rename',
            'click #refresh-tree-package': 'refreshTree',
            'click #delete-package-btn': 'delete',
            'click #upload-btn': 'upload'
        },

        initialize: function () {
            this.treeID = 'tree-package';
            this.$renameSuffixInput = this.$('#rename-suffix');
            this.$packPathInput = this.$('#packPathInput');

            this.on('refresh', this.refreshTree);

            if ( $.trim(appConf.zipPath) ) {
                this.$('#zip-package-btn').on('click', this.zip);
            } else {
                this.$('#zip-package-btn').hide();
            }

            treeModel = new app.model.TreeModel({
                id: this.treeID,
                dir: appConf.pkgPath
            });
            treeView = new app.view.TreeView(treeModel, {showcheck: true, bubbleSelect: true});
        },

        render: function () {
            treeView.render();
        },

        showSelectedItems: function ( e ) {
            var s = treeView.getCheckedNodes();

//            过滤掉目录
//            for ( var i = s.length - 1; i >= 0; i-- ) {
//                if ( !S_Utils.scriptFSO.isFilePath(s[i]) ) s.splice(i, 1);
//            }

            if ( s && s.length )
                alert(s.join('\r\n'));
            else
                alert("未选中文件！");
        },

        rename: function () {
            var that = this,
                customNameSuffix = $.trim(that.$renameSuffixInput.val()),
                pathArr = treeView.getCheckedNodes(),
                destPath = '',
                path = '',
                makePath = [],
                fileObj = {},
                deleteOriginFile = false,
                renameConfigObj = {'files': []};

            deleteOriginFile = confirm('同时删除原文件？');

            renameConfigObj['files'] = [];
            renameConfigObj['suffix'] = customNameSuffix;

            pathArr = S_Utils.folder.getUniqueFilesArr(pathArr);
//            console.log(pathArr.length + ':--------------->>' + pathArr.join(','));
            for ( var i = 0, len = pathArr.length; i < len; i++ ) {
                path = String(pathArr[i]);

//                console.log(String(pathArr[i]) + " : " + pathArr[i]);

                if ( !S_Utils.scriptFSO.isFilePath(path) ) {
//                    path += "/**";
                    continue;
                }

                destPath = String(pathArr[i]).replace(/[^\\]*$/, ""); //get Directory without Driver sign and file name.

//                console.log('path' + '[' + i + ']:' + path)

                fileObj = {};
                fileObj.expand = true;
                fileObj.src = [path];
                fileObj.dest = destPath;
                fileObj.filter = 'isFile';

                renameConfigObj['files'].push(fileObj);
            }

            if ( !renameConfigObj['files'].length ) {
                alert('未选中文件');
                return;
            }
//            console.log(JSON.stringify(renameConfigObj));
            S_Utils.scriptShell.rename(JSON.stringify(renameConfigObj));

            if ( deleteOriginFile ) that.delFiles(pathArr, true);

            that.refreshTree();
        },

        delete: function () {
            var that = this,
                path = '',
                pathArr = treeView.getCheckedNodes();

            if ( confirm('确定删除以下路径或文件？\n\r' + pathArr.join('\n\r')) ) {
                var returnVal = that.delFiles(pathArr);
                that.refreshTree();

                return returnVal;
            }

            return false;
        },

        delFiles: function ( pathArr, keepFolder ) {
            var delFileConfigObj = {'src': []};

            for ( var i = 0, len = pathArr.length; i < len; i++ ) {
                path = String(pathArr[i]);

                if(path == appConf.pkgPath) continue;

                if ( keepFolder ) {
                    if ( !S_Utils.scriptFSO.isFilePath(path) ) {
                        continue;
                    }
                }
                delFileConfigObj['src'].push(path);
            }

            if ( !delFileConfigObj['src'].length ) {
                alert('未选中文件');
                return;
            }
//            console.log(JSON.stringify(delFileConfigObj));
            S_Utils.scriptShell.del(JSON.stringify(delFileConfigObj));
            return true;
        },

        zip: function () {
            var that = this,
                zipName = '',//包名
                path = '',
                files = [],
                pathArr = treeView.getCheckedNodes(),
                fileObj = {},
                zipConfigObj = {'options': {'archive': ''}, 'files': []},
                cutPathLength = (appConf.pkgPath + "\\").length;

            fileObj.expand = true;
            fileObj.cwd = appConf.pkgPath + "\\";
//            fileObj.filter = 'isFile';
            fileObj.src = [];

            for ( var i = 0, len = pathArr.length; i < len; i++ ) {
                path = String(pathArr[i]);

                if ( !S_Utils.scriptFSO.isFilePath(path) ) {
                    path += "/**";
                }

                path = path.substr(cutPathLength);
                fileObj.src.push(path);
            }

            if ( !fileObj.src.length ) {
                alert('未选中文件');
                return false;
            }

            zipConfigObj['files'].push(fileObj);

            zipName = prompt('Zip包名：', '');

            if ( $.trim(zipName).length == 0 ) {
                return false;
            }

            zipConfigObj['options']['archive'] = appConf.zipPath + '\\' + zipName + '.zip';

            S_Utils.scriptShell.zip(JSON.stringify(zipConfigObj));

            app.view.packView.refreshTree();

            return true;
        },

        upload: function () {
            var that = this;

            switch ( appConf.uploadServer ) {
//                case appConf.serverList.server24:
//                    that.upload24();
//                    break;

                default:
                    that.uploadother();
                    break;
            }
        },

        uploadother: function () {
            var that = app.view.packView,
                path = '',
                files = [],
                pathArr = treeView.getCheckedNodes(),
                fileObj = {},
                cutPathLength = (appConf.pkgPath + "\\").length,
                uploadConfigObj = {'files': []};

            pathArr = S_Utils.folder.getUniqueFilesArr(pathArr);

            for ( var i = 0, len = pathArr.length; i < len; i++ ) {
                path = String(pathArr[i]);

                if ( !S_Utils.scriptFSO.isFilePath(path) ) {
//                    path += "/**";
                    continue;
                }

                path = path.substr(cutPathLength);

                fileObj = {};
                fileObj.expand = true;
                fileObj.cwd = appConf.pkgPath + "\\";
                fileObj.src = [path];
                fileObj.dest = appConf.uploadServer.URL;

                uploadConfigObj['files'].push(fileObj);
            }

//            console.log(JSON.stringify(uploadConfigObj));

            if ( !uploadConfigObj['files'].length ) {
                alert('未选中文件');
                return;
            }

            for ( var j = 0; j < uploadConfigObj['files'].length; j++ ) {
                files = files.concat(uploadConfigObj['files'][j].src);
            }

            if ( confirm('要上传以下文件上传到' + appConf.uploadServer.name + '吗？\n\r' + pathArr.join('\n\r')) ) {

                if ( files.length > appConf.uploadAlertCount ) {
                    if ( !that.notice('你要上传 ' + files.length + ' 个文件\n\n确定上传吗？') ) {
                        return false;
                    }
                }

                S_Utils.scriptShell.upload(JSON.stringify(uploadConfigObj));
                app.view.serverView.refreshTree();
                return true;
            }

            return false;
        },

        showPacklocalOrigin: function () {
            if ( pkgPathOrigin !== '' ) {
                this.$packPathInput.val(pkgPathOrigin);
            }
            this.refreshTree();
        },

        //提示
        notice: function ( str ) {
            return confirm('注意，' + str);
        },

        refreshTree: function () {
            var inputVal = $.trim(this.$packPathInput.val()) || '';

            if ( inputVal.length > 0 ) {
                if ( _(inputVal).endsWith('\\') ) {
                    inputVal = inputVal.substring(0, inputVal.length - 1);
                }
                if ( pkgPathOrigin === '' ) {
                    pkgPathOrigin = appConf.pkgPath;
                }
                appConf.pkgPath = inputVal;
                treeModel.set('dir', inputVal);
                this.$packPathInput.val('');
            } else {
                treeView.render();
            }
        }
    });

    app.view.packView = new PackView();

})(jQuery);
