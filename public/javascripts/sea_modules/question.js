/**
 * 
 * @authors xsbailong (liuzhilong@baidu.com)
 * @date    2014-04-06 17:14:21
 *
 */

define(function (require, exports, module) {
    module.exports = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            $(".upBtn").on("click", function(){
                var num = $(this).attr("num");
                var that = $(this);
                var str = "up" + that.attr("myId"), 
                    arr = $.cookie(str), 
                    ID = that.attr("num");
                if (arr) {
                    arr = arr.split(",");
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] === ID) {
                            break;
                        }
                    }
                    if (i === arr.length) {
                        arr.push(ID);
                        arr.join(",");
                        $.cookie(str, arr);
                    }
                    else {
                        return;
                    }
                }
                else {
                    $.cookie(str, ID);
                }
                $.post("/vote", {
                    value: 1,
                    id: $(this).attr("myId"),
                    num: $(this).attr("num")
                }, function(data){
                    that[0].innerHTML = '<small><span class="fui-heart"></span>'
                                      + data.question.answer[num].up;
                                      + '</small>';
                });
            });
            $(".downBtn").on("click", function(){
                var num = $(this).attr("num");
                var that = $(this);
                var str = "down" + that.attr("myId"),
                    arr = $.cookie(str), 
                    ID = that.attr("num");
                if (arr) {
                    arr = arr.split(",");
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] === ID) {
                            break;
                        }
                    }
                    if (i === arr.length) {
                        arr.push(ID);
                        arr.join(",");
                        $.cookie(str, arr);
                    }
                    else {
                        return;
                    }
                }
                else {
                    $.cookie(str, ID);
                }
                $.post("/vote", {
                    value: -1,
                    id: $(this).attr("myId"),
                    num: $(this).attr("num")
                }, function(data){
                    that[0].innerHTML = '<small><span class="fui-cross"></span>'
                                      + data.question.answer[num].down
                                      + '</small>';
                });
            });
        }
    }
});