/**
 * Created by ziyu.zzy on 14-3-14.
 */
define(function(require, exports,module){
    var start = {
        init : function(){
            $("#brand").delay(1000).animate({"fontSize":"2em",'top':0},1000,function(){
                $(this).css({'backgroundColor':'#3498db'});
                $("#body-main").animate({'paddingTop':'50px'},1000,function(){
                    $($(".main-logo h2")[0]).fadeIn();
                    $(".main-logo h3").fadeIn();
                });

            });

        },
        _render : function(data){

        }
    }

    module.exports = start;
});