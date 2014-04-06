/**
 * Created by ziyu.zzy on 14-4-1.
 */

function Question(q){
    this._id = q._id;
    this.title = q.title;
    this.content = q.content;
    this.time = q.time;
    this.data = q.data;
    this.a = q.a;
}


Question.prototype = {
    constructor : Question,
    init : function(){
        if(this.data === undefined){
            this.data = {
                'good' : 0,
                'bad' : 0,
                'look' : 0
            }
        }
        if(this.a === undefined){
            this.a = [];
        }
    },
    /*CURD*/
    save : function(){

    }

}


Question.updateQuetion = function(){

}
Question.getQuestion = function(id){

}

Question.deleteQuestion = function(id){

}