/**
 * 一个覆盖整个屏幕的透明层，使用户无法进行操作，一般用在一个重要流程进行中而不希望用户进行其他操作的时候。
 *
 * @class app.ui.CoverLayer
 * @constructor CoverLayer
 * @require jQuery 1.2.6+
 *
 */

(function ( $, NS ) {

    NS.CoverLayer = function ( id, tipStr ) {
        if ( !id || !tipStr ) throw new Error('CoverLayer的参数错误!');

        this.id = id;
        this.tipStr = tipStr;

        this.maxWatingTime = 60 * 1000; //最长等待时间
        this.watingTimer = null;
        this.template = '<div id="' + this.id + '" ><div class="layer"></div><p class="tip">' + this.tipStr + '</p></div>';

        this.$coverLayer = null;
        this.$layer = null;
        this.$tip = null;

        this.init();
    }

    NS.CoverLayer.prototype = {
        init: function () {
            var self = this;
            self.$coverLayer = $(self.template).appendTo('body');
            self.$layer = $(self.$coverLayer.find('div.layer')[0]);
            self.$tip = $(self.$coverLayer.find('p.tip')[0]);
            self.css();
        },
        css: function () {
            var self = this,
                $doc = $(document),
                $win = $(window),
                $docH = $doc.height() + 'px',
                $winH = $win.height() + 'px',
                $winW = $win.width() + 'px';

            setStyle();
            $win.unbind('resize').bind('resize', function ( e ) {
                $winH = $win.height() + 'px';
                $winW = $win.width() + 'px';
                setStyle();
            });

            function setStyle() {
                self.$tip.css({
                    height: $winH,
                    lineHeight: $winH
                });

                self.$coverLayer.css({
                    height: $docH
                });

                self.$layer.css({
                    height: $docH
                });
            }

        },
        show: function () {
            var self = this;

            clearTimeout(self.watingTimer);
            self.$coverLayer.fadeIn();

            self.$tip.css({
                marginLeft: -(self.$tip.width() / 2)
            });

            self.watingTimer = setTimeout(function () {
                self.hide();
                alert('执行超时！');
            }, self.maxWatingTime);
        },
        hide: function () {
            var self = this;
            clearTimeout(self.watingTimer);
            self.$coverLayer.fadeOut();
        }
    };
})(jQuery, namespace('app.ui'));