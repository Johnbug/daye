/**
 * 
 * @authors xsbailong (liuzhilong@baidu.com)
 * @date    2014-03-23 21:25:31
 *
 */

define(function (require, exports, module) {
    module.exports = {
        init: function () {
            $("#ask-modal-btn").on("click", function () {
                $.post("ask", {
                    title: $("#ask-modal-title").val(),
                    content: $("#ask-modal-content").val()
                }, function (data) {
                    if(data.status === "ok") {
                        window.location.reload();
                    }
                });
            });
        }
    }
});