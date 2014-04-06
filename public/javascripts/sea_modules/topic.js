/**
 * 
 * @authors xsbailong (liuzhilong@baidu.com)
 * @date    2014-04-05 23:15:05
 *
 */

define(function (require, exports, module) {
    module.exports = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            $(".add-topic").on(
                'click',
                function () {
                    var that = $(this);
                    var flag = false;
                    if (that.html() === '<span class="fui-plus"></span>') {
                        flag = true;
                    }
                    $.post(
                        "addTopic",
                        {
                            id: that.attr("data-id")
                        },
                        function (data) {
                            if (flag) {
                                that.html('<span class="fui-cross"></span>');
                            }
                            else {
                                that.html('<span class="fui-plus"></span>');
                            }
                        }
                    );
                }
            )
        }
    }
});