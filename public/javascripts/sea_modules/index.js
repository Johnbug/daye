/**
 * Created by ziyu.zzy on 14-3-13.
 */
define(function(require, exports,module){
    var header = require('header.js');
    var footer = require('footer.js');

    var index = {
        init : function(){
            $("#brand").css({top:0,fontSize:'2em','backgroundColor':'#3498db'});
            $("#brand").delay(500).animate({width:"10%"},1000,function(){
                $('#brand').css({'position':'fixed','top':'0','left':0});
            });
            header.init();
            //footer.init();
            this.bindEvent();

            //m2.fire();


        },
        _render : function(data){

        },
        bindEvent: function () {
            $(".collect").on(
                'click',
                function () {
                    var qid = $(this).attr("qid");
                    var that = $(this);
                    $.ajax({
                        url: '/collect',
                        method: 'post',
                        data: {
                            qid: qid
                        },
                        success: function (data) {
                            if (data.status === "ok") {
                                that[0].innerHTML = '<small class="pll subtitle">收藏成功</small>';
                            }
                        }
                    });
                }
            )
        }
    }

    module.exports = index;
});