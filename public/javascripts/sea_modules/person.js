/**
 * 
 * @authors xsbailong (liuzhilong@baidu.com)
 * @date    2014-03-29 19:18:33
 *
 */

define(function(require, exports,module) {
    var el_messagebox = $("#messagebox"),
        el_message = $("#messagebox-message")
        ;



    var header = require('header');
    var person = {
        init : function () {
            var el_user_input = $("#user-edit-body"),el_person_info = $("#person-info");
            header.init();
            $("#answer-area").hide();
            $("#editBtn").on(
                "click", 
                function () {
                    $("#showBox").hide();
                    $("#editBox").show();
                }
            );

            $("#follow").on("click",function(){
                var name = $(this).attr("data-name"),url = '/follow?name='+name,_this = this;
                $.get(url,function(data){
                    if(data.type == 'suc'){
                        el_message.html("成功关注");
                        el_messagebox.modal();
                        $(_this).attr('disabled','disabled');
                        $(_this).html('已经关注');
                    }
                });
            })



            $(".person-tab").on(
                "click",
                function () {
                    var href = $(this).attr("data-action"),url;
                    //href = href.slice(1);
                    if (href === "ask") {
                        $(".person-tab").parent().removeClass("active");
                        $(this).parent().addClass("active");
                        console.log($(this).next());
                        $("#answer-area").hide();
                        $("#question-area").show();
                        $("#follow-area").hide();
                    }
                    else if(href === "answer"){
                        $(".person-tab").parent().removeClass("active");
                        $(this).parent().addClass("active");
                        $("#answer-area").show();
                        $("#question-area").hide();
                        $("#follow-area").hide();
                    }else if(href === "followers"){
                        $(".person-tab").parent().removeClass("active");
                        $(this).parent().addClass("active");
                        $("#answer-area").hide();
                        $("#question-area").hide();
                        $("#follow-area").show().empty();
                        url = '/followers/'+$(this).attr("data-name");
                        $.get(url,function(data){
                            var res = data.result,len = res.length,
                            a = $("<a>")
                            ;
                            console.log(res);
                            for(var i = 0;i < len;i ++){

                                $("#follow-area").append(
                                    $("<small>").append($("<a>").attr("href",res[i]['name']).html(res[i]['name']))
                                )
                                //console.log(a);
                            }
                        });
                    }else{
                        $(".person-tab").parent().removeClass("active");
                        $(this).parent().addClass("active");
                        $("#answer-area").hide();
                        $("#question-area").hide();
                        $("#follow-area").show().empty();
                        url = '/followees/'+$(this).attr("data-name");
                        $.get(url,function(data){
                            var res = data.result,len = res.length
                            a = $("<a>")
                            ;
                            console.log(res);
                            for(var i = 0;i < len;i ++){
                                $("#follow-area").append(
                                    a.attr("href",res[i]['name']).html(res[i]['name'])
                                )
                            }
                        });
                    }
                }
            );
            $(':radio').radio();

            $(':radio').on("toggle",function(){
                el_user_input.find('input[name="sex-val"]').val($(this).val());
            })
            $('#cancelBtn').click(function(){
                $("#showBox").show();
                $("#editBox").hide();
            });

            $("#messagebox-comfirm").click(function(){
                $("#showBox").show();
                $("#editBox").hide();
                $("#messagebox").modal('hide');
                //console.log("22");
            })

            $('#saveBtn').click(function(){
                $.ajax({
                    url : '/user/edit',
                    method : 'post',
                    data : {
                        'sex' : el_user_input.find('input[name="sex-val"]').val(),
                        'signature' : el_user_input.find('input[name="signature"]').val(),
                        'major' : el_user_input.find('input[name="major"]').val()
                    },
                    success : function(data){
                        var info_arr = el_person_info.find("li span");
                        $("#messagebox-message").html("保存成功");
                        $(info_arr[0]).html(el_user_input.find('input[name="sex-val"]').val());
                        $(info_arr[1]).html( el_user_input.find('input[name="signature"]').val());
                        $(info_arr[2]).html(el_user_input.find('input[name="major"]').val());
                        $("#messagebox").modal({

                        });

                    }
                })
            });

        },
        _render : function(data) {

        }
    }

    module.exports = person;
});
