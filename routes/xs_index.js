/**
 * Created by ziyu.zzy on 14-3-30.
 */
//require here



module.exports = function(app){


    app.get('/test',function(req,res){
        res.send('hello,world');
    });
    


}