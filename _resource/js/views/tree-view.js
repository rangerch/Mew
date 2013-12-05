/**
 * description  构造树形目录
 *
 * @class app.view.TreeView
 */

namespace('app.view');

(function ( $ ) {
    app.view.TreeView = Backbone.View.extend({

//        defaults: {},

        initialize: function ( model, opts ) {
            var that = this;

            that.model = model;
            that.opts = opts ? opts : {};
            that.tree = $('#' + model.get('id'));

            if ( that.opts.showcheck === undefined ) {
                that.opts.showcheck = false;
            }

            this.model.on('change:dir', function () {
//                alert('change');
                that.render();
            });
        },

//        events: {},

        render: function () {
            var that = this;
            var data = [];
            //加载目录树

            data.push(that.getDirData(that.model.get('dir')));//获取目录结构;
            that.opts.data = data;

            that.tree.treeview(that.opts);
        },

        //生成用于呈现的目录数据
        getDirData: function ( dir ) {
            var that = this;
            var root = {
                "id": ("node-" + dir).replace(/[^\w]/gi, "_"),
                "text": dir,
                "value": dir,
                "showcheck": that.opts.showcheck,
                complete: true,
                "isexpand": true,
                "checkstate": 0,
                "hasChildren": true
            };
            root["ChildNodes"] = S_Utils.folder.createFolderList(dir); //Start and pass in current directory
            return root;
        },

        getCheckedNodes: function () {
            return this.tree.getCheckedNodes();
        },

        //返回所有被标记为压缩的文件路径列表及压缩后的命名列表
        getMinFileList: function () {
            var that = this,
                list = null,
                $item = null,
                path = '',
                dest = '',
                fname = '',
                ftype = '',
                suffix = '',
                suffixArr = [],
                suffixItem = null,
                suffixAnalysisError = false,
                cmd = '',
                dataArr = [];

            list = that.tree.find('input.input-text');

            for ( var i = 0, length = list.length; i < length; i++ ) {
                $item = $(list[i]);
                suffix = $.trim($item.val());
                path = $($item.siblings('a.bbit-tree-node-anchor')[0]).attr('data');

                if ( suffix == '' ) {
                    continue;
                }

                fname = S_Utils.path.getFileNameWithoutType(path);
                ftype = S_Utils.path.getFileType(path);

                if ( _(suffix).startsWith('<') || _(suffix).startsWith('>') ) { //!开头排除后缀
                    suffixArr = getCmdFromSuffix(suffix);

                    for ( var j = 0, len = suffixArr.length; j < len; j++ ) {
                        suffixItem = suffixArr[j];
                        cmd = suffixItem.substr(0, 1);
                        suffixItem = suffixItem.substr(1);

                        if ( cmd == '>' && suffixItem.length >= fname.length ) {
                            suffixAnalysisError = true;
                            fname = '';
                            break;
                        }

                        switch ( cmd ) {
                            case '<':
                                fname += suffixItem;
                                break;

                            case '>':
                                fname = fname.substring(0, fname.length - suffixItem.length);
                                break;

                            default:
                                break;
                        }
                    }

                }
                else {
                    fname += suffix;
                }

//                console.log(fname);

                if ( fname !== '' ) {
                    dataArr.push({
                        origin: path,
                        min: path.replace(/[^\\]*$/, "") + fname + '.' + ftype,
                        type: ftype
                    });
                }
            }

            /**
             * @description 从字符串中解析出压缩文件的后缀指令
             * @example
             *      input: '>-debug<-min'
             *      output: ['>-debug', '<-min']
             *
             *      '>': 从文件名中去除该部分后缀 (remove)
             *      '<': 向文件名加入后面的后缀 (append)
             */
            function getCmdFromSuffix( str ) {
                return $.trim(str).match(/[><][^><]*/gi);
            }

            return dataArr;
        }


    });
})(jQuery);
