/**
 * description 工作目录视图, Singleton
 *
 * @class app.view.WorkView
 */

namespace('app.view');

(function ( $ ) {
    var treeView = null,
        treeModel = null;

    var ServerView = Backbone.View.extend({

        el: '#serverPart',

        events: {
            'click #showchecked-treeserver': 'showSelectedItems',
            'click #refresh-tree-server': 'refreshTree',
            'click #show-testserver-btn': 'showTestServer',
            'click #show-packserver-btn': 'showPackServer'
        },

        initialize: function () {
            this.treeID = 'tree-server';
            this.$serverPathInput = this.$('#serverPathInput');
            this.$title = this.$('h5:eq(0)');
            this.$title.html(appConf.uploadServer.name);

            treeModel = new app.model.TreeModel({
                id: this.treeID,
                dir: appConf.uploadServer.URL
            });

            treeView = new app.view.TreeView(treeModel);
        },

        render: function () {
            treeView.render();
        },

        showSelectedItems: function ( e ) {
            var s = treeView.getCheckedNodes();

            if ( s && s.length )
                alert(s.join('\r\n'));
            else
                alert("未选中文件！");
        },

        showTestServer: function () {
            appConf.uploadServer = appConf.serverList.server2;
            this.refreshTree();
        },

        showPackServer: function () {
            appConf.uploadServer = appConf.serverList.server1;
            this.refreshTree();
        },

        refreshTree: function () {
            treeModel.set('dir', appConf.uploadServer.URL);
            this.$title.html(appConf.uploadServer.name);
            treeView.render();
        }
    });

    app.view.serverView = new ServerView();

})(jQuery);
