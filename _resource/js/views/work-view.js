/**
 * description 工作目录视图, Singleton
 *
 * @class app.view.WorkView
 */

namespace('app.view');

(function ( $ ) {
    var treeView = null,
        treeModel = null,
        PACKING_ORIGIN_TREE = 1,
        PACKING_ORIGIN_TEXT = 2,
        packingInputMehtod = PACKING_ORIGIN_TREE; //输入来源

    var WorkView = Backbone.View.extend({

        el: '#workPart',

        events: {
            'click #showchecked-tree': 'showSelectedItems',
            'click #packing-btn': 'pack',
            'click #refresh-tree': 'refreshTree',
            'click #switch-input-method-btn': 'switchInputMethod',
            'click .bbit-tree-node-el .min': 'onMinClicked',
            'click .bbit-tree-node-el .nomin': 'onNominClicked',
            'click #min-btn': 'minify'
        },

        initialize: function () {
            this.treeID = 'tree-work';
            this.$customInput = this.$('#custom-input-outter').find('textarea')[0];
            this.$packingPathInput = this.$('#packing-path');
            this.$customInputOutter = this.$('#custom-input-outter');
            this.$customInput = this.$('#custom-input');
            this.$workPathInput = this.$('#workPathInput');
            this.justTrigger = false;

            treeModel = new app.model.TreeModel({
                id: this.treeID,
                dir: appConf.codePath
            });

            treeView = new app.view.TreeView(treeModel, {showcheck: true, bubbleSelect: true, showmin: true});
        },

        render: function () {
            treeView.render();
        },

        showSelectedItems: function ( e ) {
            var that = this,
                s = [];

            if ( packingInputMehtod == PACKING_ORIGIN_TEXT ) {
                s = that.$customInput.html().replace(/[\r\n\s]*/g, '').split(',');
            } else {
                s = treeView.getCheckedNodes();
//                for ( var i = s.length - 1; i >= 0; i-- ) {
//                    if ( !S_Utils.scriptFSO.isFilePath(s[i]) ) s.splice(i, 1);
//                }
            }

            if ( s && s.length )
                alert(s.join('\r\n'));
            else
                alert("未选中文件！");
        },

        switchInputMethod: function ( e ) {
            var that = this;
            var $btn = $(e.currentTarget);

            if ( packingInputMehtod == PACKING_ORIGIN_TREE ) {
                $btn.html('<img src="_resource/images/action_tree_editor.gif" title="树状图" />');
                $btn.removeClass('highlight2').addClass('highlight3');
                that.$customInputOutter.fadeIn();
                that.$customInput.focus();

                packingInputMehtod = PACKING_ORIGIN_TEXT;
            } else if ( packingInputMehtod == PACKING_ORIGIN_TEXT ) {
                $btn.html('<img src="_resource/images/action_code_editor.gif" title="代码视图" />');
                $btn.removeClass('highlight3').addClass('highlight2');

                that.$customInputOutter.fadeOut();
                packingInputMehtod = PACKING_ORIGIN_TREE;
            }
        },

        onMinClicked: function ( e ) {
            var that = this,
                $el = $(e.currentTarget),
                $father = $($el.parent()),
                $input = $('<input type="text" class="input-text"/>');

            if ( that.justTrigger ) return;

            $el.removeClass('min').addClass('nomin');
            $father.append($input);
            $input.focus();

            $input.bind('blur', function ( e ) {
                var $this = $(this);
                if ( $.trim($this.val()) == '' ) {
                    $el.trigger('click', {'isTrigger': true});
                }
            });
        },

        onNominClicked: function ( e ) {
            var that = this,
                $el = $(e.currentTarget),
                $father = $($el.parent());

            if ( that.justTrigger ) return;

            if ( e['isTrigger'] ) {
//                alert('trigger')
                that.justTrigger = true;
                setTimeout(function () {
                    that.justTrigger = false;
                }, 100);
            }
            $el.removeClass('nomin').addClass('min');
            $($father.find('input.input-text')[0]).remove();
        },

        minify: function ( data ) {
            var that = this,
                item = null,
                jsData = [],
                cssData = [],
                noticeStr = '',
                jsminConfigObj = {'files': {}},
                cssminConfigObj = {'files': {}},
                data = treeView.getMinFileList();

            if ( data && data.length ) {
                //数据分组
                for ( var i in data ) {
                    item = data[i];
//                    console.log(item.origin);
                    switch ( item['type'] ) {
                        case 'js':
                            jsData.push(item);
                            noticeStr += "[js]:" + item.origin + " -> " + item.min + "\n\r";
                            break;
                        case 'css':
                            cssData.push(item);
                            noticeStr += "[css]:" + item.origin + " -> " + item.min + "\n\r";
                            break;

                        default:
                            break;
                    }
                }

                if ( jsData.length ) {
                    for ( var i = 0, len = jsData.length; i < len; i++ ) {
                        jsminConfigObj['files'][jsData[i].min] = jsData[i].origin;
                    }

//                    console.log(JSON.stringify(jsminConfigObj));
                }


                if ( cssData.length ) {
                    for ( var i = 0, len = cssData.length; i < len; i++ ) {
                        cssminConfigObj['files'][cssData[i].min] = cssData[i].origin;
                    }

//                    console.log(JSON.stringify(cssminConfigObj));
                }

                if ( noticeStr != '' && confirm('确定压缩以下数据吗？\n\r' + noticeStr) ) {
                    if ( jsData.length ) {
                        S_Utils.scriptShell.jsmin(JSON.stringify(jsminConfigObj));
                    }
                    if ( cssData.length ) {
                        S_Utils.scriptShell.cssmin(JSON.stringify(cssminConfigObj));
                    }
                }


//                that.refreshTree();
            } else {
                alert('请选择要压缩的文件.');
            }
        },

        pack: function () {
            var that = this,
                customPackingFilePath = $.trim(that.$packingPathInput.val()),
                path = '',
                pathArr = [],
                makePath = [],
                fileObj = {},
                cwd = '',
                jsonObj = {},
                isFile = false,
                copyConfigObj = {'files': []};

            if ( packingInputMehtod == PACKING_ORIGIN_TREE ) {
                pathArr = treeView.getCheckedNodes();
                cwd = appConf.codePath;
            } else if ( packingInputMehtod == PACKING_ORIGIN_TEXT ) {
//                pathArr = that.$customInput.html().replace(/[\r\n\s]*/g, '').split(',');
                try {
                    jsonObj = JSON.parse(that.$customInput.html());
                    cwd = jsonObj.cwd;
                    pathArr = _.map(jsonObj.files, function ( path ) {
                        return cwd + path;
                    });
                } catch ( e ) {
                    alert('无法解析数据！');
                    return false;
                }
            }

            for ( var i = 0, len = pathArr.length; i < len; i++ ) {
                path = String(pathArr[i]);

                if ( !S_Utils.scriptFSO.isFilePath(path) ) {
                    path += "/**";
                }
                path = path.substr(cwd.length).replace(/\\*(.*)/, '$1');

                fileObj = {};
                fileObj.expand = true;
                fileObj.src = [path];
                fileObj.cwd = cwd;
                fileObj.dest = appConf.pkgPath + "\\" + (customPackingFilePath.length ? customPackingFilePath : appConf.defaultPackageNameRule()) + "\\";

                copyConfigObj['files'].push(fileObj);
            }

            if ( !copyConfigObj['files'].length ) {
                alert('未选中文件');
                return;
            }

            S_Utils.scriptShell.pack(JSON.stringify(copyConfigObj));
            app.view.packView.trigger('refresh');
        },

        refreshTree: function () {
            var inputVal = $.trim(this.$workPathInput.val()) || '';
            if ( inputVal.length > 0 ) {
                appConf.codePath = inputVal;
                treeModel.set('dir', inputVal);
                this.$workPathInput.val('');
            } else {
                treeView.render();
            }
        }
    });

    app.view.workView = new WorkView();

})(jQuery);
