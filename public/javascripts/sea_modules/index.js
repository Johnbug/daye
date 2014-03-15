/**
 * Created by ziyu.zzy on 14-3-13.
 */
define(function(require, exports,module){
    var index = {
        init : function(){
            $("#brand").css({top:0,fontSize:'2em','backgroundColor':'#3498db'});
            $("#brand").delay(500).animate({width:"10%"},1000);

        },
        _render : function(data){

        }
    }

    module.exports = index;
});