/**
 * Created by ziyu.zzy on 14-3-15.
 */
define(function(require,exports,module){

    module.exports = {
        init : function(){
            $('#ask').click(function(){
               $("#ask-modal").modal();
            });
        }

    }


});