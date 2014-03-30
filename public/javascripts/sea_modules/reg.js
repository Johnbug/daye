/**
 * Created by ziyu.zzy on 14-3-29.
 */
define(function(require,exports,module){
    var el_name = $("#input-name"),el_pass = $("#input-pass"),el_passcom =$("#input-pass-com");
    $("#reg").click(function(){
        var username,pass,pass_com,url;

        username = el_name.val();
        pass = el_pass.val();
        pass_com = el_passcom.val();
        url = '/reg';
        //console.log(username);
        $.ajax({
            method : 'post',
            url : url,
            data: {
                'name' : username,
                'password' : pass,
                'password_com' : pass_com
            },
            success : function(data){
                if(data.type == 'err'){
                    if(data.ms == 'user-exit'){
                        $el_passcom.removeClass('has-error');
                        //$el_pass.removeClass("has-error");
                        $el_name.addClass('has-error');
                    }else if(data.ms=="com-err"){
                        $el_name.removeClass('has-error');
                        //$el_pass.removeClass("has-error");
                        $el_passcom.addClass('has-error');
                    }else{
                        alert("server error");
                    }
                }else{
                    window.location = '/';
                }
            }
        })

    })
});