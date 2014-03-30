/**
 * 
 * @authors xsbailong (liuzhilong@baidu.com)
 * @date    2014-03-29 19:18:33
 *
 */

define(function(require, exports,module) {
    var header = require('header');
    var person = {
        init : function () {
            var el_user_input = $("#user-edit-body");
            header.init();
            $("#editBtn").on(
                "click", 
                function () {
                    $("#showBox").hide();
                    $("#editBox").show();
                }
            );

            $(".person-tab").on(
                "click",
                function () {
                    var href = $(this).attr("href");
                    href = href.slice(1);
                    if (href === "ask") {
                        $(this).parent().addClass("active").next().removeClass("active");
                        console.log($(this).next());
                        $("#person-answer").hide();
                        $("#person-ask").show().add;
                    }
                    else {
                        $(this).parent().addClass("active").prev().removeClass("active");
                        $("#person-answer").show();
                        $("#person-ask").hide();
                    }
                }
            );
            $(':radio').radio();

            $('#cancelBtn').click(function(){
                $("#showBox").show();
                $("#editBox").hide();
            });

            $('#saveBtn').click(function(){
                $.ajax({
                    url : '/user/edit',
                    method : 'post',
                    data : {
                        'sex' : el_user_input.find('input[name="sex"]').val(),
                        'signature' : el_user_input.find('input[name="signature"]').val(),
                        'major' : el_user_input.find('input[name="major"]').val()
                    }
                })
            });

        },
        _render : function(data) {

        }
    }

    module.exports = person;
});
