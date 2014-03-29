/**
 * Created by ziyu.zzy on 14-3-14.
 */
define(function(require, exports,module){
    var header = require('header');
    var start = {
        init : function(){
            header.init();
            $("#login-btn").click(function(){
                //console.log("s");
                $("#login-modal").modal();
            });

            $("#login").click(function(){
                var url = '/login';
                $.ajax({
                    url:url,
                    method:'post',
                    data : {
                        name : $('#login-name').val(),
                        password : $('#login-pass').val()
                    },
                    success : function(data){
                        console.log(data);
                        if(data.type === 'suc'){
                            window.location = '/';
                        }else{
                            if(data.mes === 'no-user'){
                                $("#pass-state").removeClass('has-error');
                                $("#name-state").addClass('has-error');
                            }else{
                                $("#name-state").removeClass('has-error');
                                $("#pass-state").addClass('has-error');
                            }
                        }
                    }
                });
            })
        },
        _render : function(data){

        }
    }

    module.exports = start;
});