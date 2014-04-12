/**
 * Created by jonbug on 13-12-9.
 */

var crypto = require('crypto'),
    User = require('../models/user');
    //User = require('../models/_user');

var userAction = {
    reg_render : function(req,res){
        res.render('register',{title:'register'});
    },

    reg : function(req,res){
        var name = req.body.name,
            password = req.body.password,
            password_com = req.body.password_com,
            password_md5;

        if(password == password_com){

        var  md5 = crypto.createHash('md5');
        password_md5 = md5.update(password).digest('hex');

        var newUser = new User({
            name: name,
            password: password_md5
        });
        //使用user.js中的user.get() 函数来读取用户信息
        User.get(newUser.name, function(err, user){
            //如果有返回值，表示存在用户
            var  err_d;
            if(user){
                err_d = '用户已存在!';
            }
            if(err_d){
                //如果报错，记录错误信息和页面跳转
                //console.log(err);
                req.flash('error', err);
                res.send({
                    'type' : 'err',
                    'ms' : 'user-exit'
                })
                //return res.redirect('/');
            }
            //使用user.js的user.save() 保存信息函数
            newUser.save(function(err,user){
                if(err){
                    req.flash('error',err);
                    //return res.redirect('/');
                    res.send({
                        'type' : 'err',
                        'ms' : 'server-err'
                    })
                }
                //成功后，将用户信息记录在页面间的会话req.session中，并且跳转到一个新页面，就是内容集中展示页面
                //console.log(user);
                req.session.user = user[0];
                //req.flash('success','注册成功!');
                //res.redirect('/user');
                res.send({
                    'type' : 'suc',
                    'ms' : 'success'
                });
            });
        });
        }else{
            res.send({
                'type' : 'err',
                'ms' : "com-err"
            })
        }
    },

    ask : function(req,res){
        var que = {};
        que.title = req.body.title;
        que.content = req.body.content;
        que.topic = req.body.topic;
        que.answer = [];
        que.time = new Date();
        que.user = req.session.user.name;
        que.collector = [];
        console.log(que);
        User.ask(que, function(err, result){
            if(err){
                req.flash('error', err);
                return res.redirect("/");
            }
            res.send({"status": "ok"});
        });
    },

    login : function(req,res){

            var name = req.body.name,
                password = req.body.password;
            console.log(name);
            var md5 = crypto.createHash('md5'),
                password_md5 = md5.update(password).digest('hex');

            var newUser = new User({
                name: name,
                password: password_md5
            });

            User.get(newUser.name, function(err, user){
                //如果有返回值，表示存在用户
                if(user){
                    if(user.password != password_md5){
                        //req.flash('error','密码不正确');
                        //res.redirect('/');
                        res.send({
                            type : 'err',
                            mes : 'wrong-pass'
                        });
                    }else{
                        req.session.user = user;
                        res.send({
                            type : 'suc',
                            mes  : '成功'
                        });
                    }
                } else{
                    res.send({
                        type : 'err',
                        mes  : 'no-user'
                    })
                }
            });


    },

    follow : function(req,res){

        var followed_name = req.query.name,follow_name = req.session.user.name;

        User.get(followed_name,function(err,user){
            if(user){
                //console.log(user);
                if(!user.followed){
                    user.followed = [];
                }
                var rec=false;
                for(var i = 0;i < user.followed.length;i ++){
                    if(user.followed[0] == follow_name) {
                        rec = true;
                        break;
                    }
                }
                if(!rec){
                user.followed.push(follow_name);

                User.updateUser(user,function(err,ms){
                    if(err || ms=='err'){
                        res.send({
                            type:'err',
                            ms:'server error'
                        });
                    }else{
                        res.send({
                            type : 'suc',
                            ms : 'success'
                        })
                    }
                })}
                else{
                    res.send({
                        type : "err",
                        ms : 'dont do it'
                    })
                }
            }else{
                res.send({
                    type : 'err',
                    ms : 'no-user'
                })
            }
        });

        User.get(follow_name,function(err,user){
            if(user){
                if(!user.follow ){
                    user.follow = [];
                }
                var rec=false;
                for(var i = 0;i < user.follow.length;i ++){
                    if(user.follow[0] == followed_name) {
                        rec = true;
                        break;
                    }
                }
                if(!rec){
                user.follow.push(followed_name);

                User.updateUser(user,function(err,ms){
                    if(err || ms=='err'){
                        res.send({
                            type:'err',
                            ms:'server error'
                        });
                    }else{
                        req.session.user = user;
                        //console.log(user);
                        //res.locals.curUser = req.session.user;
                        res.send({
                            type : 'suc',
                            ms : 'success'
                        })
                    }
                })
                }else{
                    res.send({
                        type : 'err',
                        ms : 'no-user'
                    })
                }
            }else{
                res.send({
                    type:'err',
                    ms : 'no-user-op'
                })
            }
        })
    },

    followees : function(req,res){
        var name = req.params.name;

        User.get(name,function(err,user){
            //console.log(name);
            User.getFollowees(user,function(err,result){
                console.log(result);
                res.send({
                    'result' : result
                })
            });

        });
    },

    followers : function(req,res){
        var name = req.params.name;

        User.get(name,function(err,user){
            //console.log(name);
            User.getFollowers(user,function(err,result){
                //console.log(result);
                res.send({
                    'result' : result
                })
            });

        });
    },

    userFollowQuestion : function(req,res){
        var name = req.session.user.name;

        User.get(name,function(err,user){
            console.log(user);
           User.getUserFollowQuestion(user,function(err,result){
               res.send({
                   'result' : result
               })
           }) ;
        });
    },


    logout:function(req,res){
        delete req.session.user;
        res.redirect('/')
    }
}

module.exports = userAction;