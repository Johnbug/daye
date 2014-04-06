
/*
 * GET home page.
 */
var crypto = require('crypto'),
    User = require('../models/user.js'),
    userAction = require('./user.js'),
    xs_route =require('./xs_index');

/*
var user = require('./user.js');

var routesTable = {
    'user':{
        '/user' : user.index
    }
}
*/


module.exports = function(app){
    xs_route(app);

    app.get('/',function(req,res){

        if(req.session.user != null){
            console.log(req.session.user);
            User.getQuestion(function(err, ques){
                res.render('index-1', { title: 'daye', list: ques ,usr : req.session.user});
            });
        }else{
            res.redirect('/start');
        }
    });

    //register
    app.get('/reg',userAction.reg_render);
    app.post('/reg',userAction.reg);



    //log in
    app.get('/login',function(req,res){
        res.render('login',{title:'login'});

    });

    app.post('/login',userAction.login);

    //user page
    app.get('/user',function(req,res){
        User.list('name',function(err,items){
            if(err){
                err = 'OMG';
            }
            res.render('user',{title:"All users list",users:items});
        });

    });

    app.get('/beta',function(req,res){
        res.render('beta',{title:"beta"});
    });

    //ask
    app.post('/ask', userAction.ask);

    //answer page
    app.get('/question/:id', function(req, res){
        User.findQuestion(req.params.id, function(err, result){
            if(err){
                req.flash('error', err);
                return res.redirect("/");
            }
            res.render('question', {'title': "question",'question': result});
        });
    });

    //answer question
    app.post('/answer', function(req, res){
        var answer = {};
        var id = req.body.id;
        answer.content = req.body.content;
        answer.up = 0;
        answer.down = 0;
        answer.user = req.session.user.name;
        User.answer(id, answer, function(err, result){
            if(err){
                req.flash('error', err);
            }
            res.redirect("/question/" + id);
        });
    });

     //收藏问题
    app.post(
        '/collect', 
        function (req, res) {
            var id = req.body.qid;
            var user = req.session.user.name;
            User.collect(
                id,
                user,
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.send({"status": "ok"});
                }
            );
        }
    );

    //取消收藏
    app.post(
        '/uncollect', 
        function (req, res) {
            var id = req.body.qid;
            var user = req.session.user.name;
            User.uncollect(
                id,
                user,
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.send({"status": "ok"});
                }
            );
        }
    );

    /*
    *@ 我的收藏夹接口，返回值中list是收藏的问题组成的数组。
    */
    app.get(
        '/collection',
        function (req, res) {
            var user = req.session.user.name;
            if (!user) {
                res.send({title: 'collection', list: []});
            }
            User.collection(
                user,
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.send({title: 'collection', list: result});
                }
            );   
        }
    );

    //vote answer
    app.post('/vote', function(req, res){
        var vote = req.body.value;  //顶或者踩
        var id = req.body.id;   //问题id
        var num = req.body.num; //第几个answer
        User.vote(id, num, vote, function(err, result){
            if(err){
                req.flash('error', err);
            }
            res.send({"question": result});
        });
    });

    //user page
    app.get('/user/:id', function(req, res){
        User.get(req.params.id, function(err, result){
            if(err){
                req.flash('error', err);
            }
            User.getUserQuestion(req.params.id, function(err, questions){
                if(err){
                    req.flash('error', err);
                }
                User.getUserAnswer(req.params.id, function(err, answers){
                    if(err){
                        req.flash('error', err);
                    }

                    res.render('person', {
                        "title": req.params.id, 
                        "user": result, 
                        "questions": questions,
                        "answers": answers

                    });
                })
            });
        });
    });

    //编辑个人信息
    app.post('/user/edit', function(req, res){
        var user = {};
        user.sex = req.body.sex;
        user.signature = req.body.signature;
        user.major = req.body.major;
        user.name = req.session.user.name;
        User.editUser(user, function(err, result){
            if(err){
                req.flash('error', err);
            }
            //res.redirect("/user/" + user.name);
            res.send({
                'type' : 'sec',
                'result' : result
            })
        });
    });

    app.get('/start',function(req,res){
        res.render('start',{title:'start'});
    });

    app.get('/logout',userAction.logout);

    app.get('/angular',function(req,res){
       res.render('angular',{layout:'none'});
    });


    app.get('/angular_data',function(req,res){
       res.send({
           user : {name:'johnbug',age:'11'}
       })
    });

    app.get('/follow',userAction.follow);

    app.get('/followees/:name',userAction.followees);
    app.get('/followers/:name',userAction.followers);
};
