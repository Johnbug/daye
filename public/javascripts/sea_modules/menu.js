/**
 * Created by ziyu.zzy on 14-3-15.
 */
define(function(require,exports,module){

    var Menu = function(par,url){
        this.par = par;
        this.url = url;
        this.ul = null;
    }

    Menu.prototype = {
        constructor:Menu,
        init :function(){
            var par = this.par,url = this.url;
            var width = par.outerWidth(),len = url.length;
            var ul = $('<ul></ul>');
            this.ul = ul;
            $('body').append(ul);
            console.log(ul);
            var offsetLeft = par.offset().left,offsetBottom = par.offset().top + par.outerHeight();
            ul.css({'display':'none','width':width,'border':'1px solid #aaa','position':'absolute'
                ,'top':offsetBottom,'zIndex':'1','left':offsetLeft});
            //this.ul.css('display','block');
            for(var i = 0;i < len;i ++){
                var li = $('<li></li>'),a = $('<a></a>');
                li.css({'listStyle':'none'});
                a.attr('href',url[i].href).html(url[i].htm);
                if(url[i].cb){
                    a.click(url[i].cb);
                }
                li.append(a);
                ul.append(li);
            }
        },

        fire:function(){

            console.log(this.ul);
            this.ul.css('display','block');
            console.log(this.ul.css('display','block'));
        },

        ext : function(){
            console.log("ds");
            this.ul.css({'display':'none'});
        }




    }

    module.exports = Menu;
})