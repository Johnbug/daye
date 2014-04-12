/**
 * 
 * @authors xsbailong (liuzhilong@baidu.com)
 * @date    2014-03-23 21:25:31
 *
 */

define(function (require, exports, module) {
    module.exports = {
        init: function () {
            $.post(
                "allTopic",
                {},
                function (data) {
                    data = data.result;
                    console.log(data);
                    var options = "";
                    for (var i = 0; i < data.length; i++) {
                        options += "<option>" + data[i].title + "</option>";
                    }
                    $("#ask-modal-topic").html(options);
                }
            );
            this.bindEvent();
        },
        bindEvent: function () {
            $("#ask-modal-btn").on(
                "click", 
                function () {
                    var topic = "";
                    $("#ask-modal-topic :selected").each(function () {
                        topic += $(this).text()+',';
                    });
                    topic = topic.split(',');
                    topic.pop();
                    $.post(
                        "ask",
                        {
                            title: $("#ask-modal-title").val(),
                            content: $("#ask-modal-content").val(),
                            topic: topic
                        }, 
                        function (data) {
                            if(data.status === "ok") {
                                window.location.reload();
                            }
                        }
                    );
                }
            );
        }
    }
});