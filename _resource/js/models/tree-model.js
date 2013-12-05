/**
 * description 打包目录的Model.
 *
 * @class app.model.PackModel
 */

namespace('app.model');

(function(){
    app.model.TreeModel = Backbone.Model.extend({
        default: {
            modelName: '',
            dir: ''
        },

        initialize: function(opts){
            this.dir = opts['dir'];
        }




    });
})();