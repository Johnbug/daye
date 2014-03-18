/**
 * Created by ziyu.zzy on 14-3-13.
 */
define(function(require, exports,module){
    var header = require('header.js');

    var index = {
        init : function(){
            $("#brand").css({top:0,fontSize:'2em','backgroundColor':'#3498db'});
            $("#brand").delay(500).animate({width:"10%"},1000,function(){
                $('#brand').css({'position':'fixed','top':'0','left':0});
            });
            header.init();



            //m2.fire();


        },
        _render : function(data){

        }
    }

    module.exports = index;
});