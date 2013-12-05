/**
 * description  主应用model.
 *
 * @class app.model.AppModel
 */

namespace('app.model');

(function(){
    app.model.AppModel = Backbone.Model.extend({
        defaults: {
            modelName: 'AppModel',
            completed: false
        }
    });
})();