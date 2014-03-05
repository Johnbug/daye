
/*
 * GET home page.
 */
var crypto = require('crypto'),
    User = require('../models/user.js');

/*
var user = require('./user.js');

var routesTable = {
    'user':{
        '/user' : user.index
    }
}
*/


module.exports = function(app){
    app.get('/',function(req,res){
        User.getQuestion(function(err, ques){
            res.render('index', { title: 'daye', list: ques });
        });
    });

    //register
    app.get('/reg',function(req,res){
        res.render('register',{title:'register'});
    });
    app.post('/reg',function(req,res){
        var name = req.body.name,
            password = req.body.password;
        //对密码进行加密操作
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password
        });
        //使用user.js中的user.get() 函数来读取用户信息
        User.get(newUser.name, function(err, user){
            //如果有返回值，表示存在用户
            if(user){
                err = '用户已存在!';
            }
            if(err){
                //如果报错，记录错误信息和页面跳转
                req.flash('error', err);
                return res.redirect('/');
            }
            //使用user.js的user.save() 保存信息函数
            newUser.save(function(err,user){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/');
                }
                //成功后，将用户信息记录在页面间的会话req.session中，并且跳转到一个新页面，就是内容集中展示页面
                req.session.user = user;
                req.flash('success','注册成功!');
                res.redirect('/user');
            });
        });
    });
    //log in
    app.get('/login',function(req,res){
        res.render('login',{title:'login'});

    });

    app.post('/login',function(req,res){
        var name = req.body.name,
            password = req.body.password;
        //对密码进行加密操作
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password
        });

        User.get(newUser.name, function(err, user){
            //如果有返回值，表示存在用户
            if(user){
                if(user.password != password){
                    req.flash('error','密码不正确');
                    res.redirect('/');
                }else{
                    req.session.user = user;
                    res.redirect('/user');
                }
            } else{
                req.flash('error','用户不存在');
                res.redirect('/');
            }
        });

    });

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
    app.post('/ask', function(req,res){
        var que = {};
        que.name = req.session.user;
        que.title = req.body.title;
        que.content = req.body.content;
        que.answer = [];
        que.up = 0;
        que.down = 0;
        que.time = new Date();
        User.ask(que, function(err, result){
            if(err){
                req.flash('error', err);
                return res.redirect("/");
            }
            res.send({"status": "ok"});
        });
    });

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
        //answer.user = ;
        User.answer(id, answer, function(err, result){
            if(err){
                req.flash('error', err);
            }
            res.redirect("/question/" + id);
        });
    });

    //vote answer
    app.post('/vote', function(req, res){
        var vote = req.body.value;  //顶或者踩
        var id = req.body.id;   //问题id
        var num = req.body.num; //第几个answer
        User.vote(id, num, vote, function(err, result){
            console.log(num);
            if(err){
                req.flash('error', err);
            }
            res.send({"question": result});
        });
    });
};

