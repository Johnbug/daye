/**
 * Created by ziyu.zzy on 14-3-15.
 */
define(function(require,exports,module){
   var Menu = require('menu.js');
   var header = {
       init:function(){
           $('.flat-ui-header').css({'display':"block"});
           $('.searchBar input').focus(function(){
               $(this).animate({'width':"400px"},500);
           }).blur(function(){
                   $(this).animate({'width':'100px'},500);
               });

           var m = new Menu($($('.user')[0]),[
               {href:'/logout',htm:'退出'}
           ]);

           m.init();
           //m.fire();
           $($('.user')[0]).click(function(event){
               event.stopPropagation();
               m.fire();
           });
           $('body').click(function(){
               //e.preventDefault();
               m.ext();
           })
       },

       ask:function(el){
           console.log(el);
           el.click(function(){

                $("#ask-form").modal({fadeDuration: 300});
           });
       }
   }

    module.exports = header;
});