/**
 * @class app.view.AppView
 */

namespace('app.view');

(function ( $ ) {

    var isImgPreviewerOut = false;
    var imgPreviewerTimer = null;


    var AppView = Backbone.View.extend({

        el: '#dev-simplify',

        // The DOM events specific to an item.
        events: {
            'click #install-btn': S_Utils.scriptShell.installApp,
            'mouseenter .bbit-tree-node-leaf-img .bbit-tree-node-anchor': 'imgPreview',
            'mouseleave .bbit-tree-node-leaf-img .bbit-tree-node-anchor': 'imgPreview'
        },

        initialize: function () {
            this.model = new app.model.AppModel();
            this.cover = new app.ui.CoverLayer('cover-layer', 'Processing, wait a minute please.');

            this.$imgPreviewer = $('#imgPreviewer');

            this.on('startworking', this.startWorking);
            this.on('stopworking', this.stopWorking);
        },

        render: function () {
            this.makeRainbowText();
            app.view.workView.render();
            app.view.packView.render();
            app.view.serverView.render();
            return this;
        },

        imgPreview: function ( e ) {
            var that = this,
                $el = $(e.currentTarget),
                delay = 300,
                docEL = document.documentElement;

            var mouseEnterHandle = function () {
                that.$imgPreviewer.find('img:eq(0)').attr('src', $el.attr('data'));
                that.$imgPreviewer.find('.title:eq(0)').text($el.find('span:eq(0)').text());

                that.$imgPreviewer.css({
                    'left': e.clientX + docEL.scrollLeft + 20,
                    'top': e.clientY + docEL.scrollTop
                });

                that.$imgPreviewer.fadeIn('fast');
            };

            switch ( e.type ) {
                case 'mouseenter':
                    isImgPreviewerOut = false;
                    clearTimeout(imgPreviewerTimer);
                    imgPreviewerTimer = setTimeout(function () {
                        if ( !isImgPreviewerOut ) {
                            mouseEnterHandle();
                        }
                    }, delay);
                    break;
                case 'mouseleave':
                    isImgPreviewerOut = true;
                    clearTimeout(imgPreviewerTimer);
                    that.$imgPreviewer.fadeOut('fast');

                    break;

                default:
                    break;
            }
//            console.log($el.attr('data'));
        },

        makeRainbowText: function () {
            var pharse = Math.floor(Math.random() * 10);
            var $h1 = $('#header h1');
            var $ver = $('#tools-version');
            var verStr = 'Ver:' + appConf.ver + ', ' + appConf.buildDate;

            var h1html = $h1.text();
            var num = 0;

            var timer = setInterval(function () {
                if ( num < h1html.length ) {
                    num++;
                } else {
                    clearInterval(timer);
                }
                $h1.html(S_Utils.effect.rainbow.createRainbowText(h1html.substr(0, num), pharse));
            }, 20);

            $ver.html(S_Utils.effect.rainbow.createRainbowText(verStr, pharse));
        },

        /**
         * 监听切换标签
         */
        listenSwitch: function () {
            var $switch = $('#switch-tabs');
            var tabs = $switch.find('.tab');
            var curClassName = 'cur';
            var ids = [];

            for ( var i = 0, len = tabs.length; i < len; i++ ) {
                var $item = $(tabs[i]);
                ids.push($item.attr('data-wrapid'));
                $item.bind('click', function ( e ) {
                    var $curItem = $(e.currentTarget);
                    var $curWrap = $('#' + $curItem.attr('data-wrapid'));
                    var ifr = null;

                    for ( var ii = 0, len2 = ids.length; ii < len2; ii++ ) {
                        $('#' + ids[ii]).stop(1, 1).hide();
                    }

                    tabs.removeClass('cur');

                    $curItem.addClass('cur');
                    $curWrap.stop(1, 1).show();

                });
            }
        },

        startWorking: function () {
            this.cover.show();
        },

        stopWorking: function () {
            this.cover.hide();
        }
    });

    app.view.appView = new AppView();

})(jQuery);
