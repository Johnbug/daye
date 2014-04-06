/**
 * Created by ziyu.zzy on 14-3-15.
 */
define(function(require,exports,module){

    module.exports = {
        init : function(){
            $('#ask').click(function(){
               $("#ask-modal").modal();
            });

            $("#ask-modal-btn").on("click", function () {
                $.post("/ask", {
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