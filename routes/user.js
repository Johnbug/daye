/**
 * Created by jonbug on 13-12-9.
 */

var crypto = require('crypto'),
    User = require('../models/user.js'),
    md5 = crypto.createHash('md5')

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
        que.answer = [];
        que.time = new Date();
        que.user = req.session.user.name;
        User.ask(que, function(err, result){
            if(err){
                req.flash('error', err);
                return res.redirect("/");
            }
            res.send({"status": "ok"});
        });
    },

    logout:function(req,res){
        delete req.session.user;
        res.redirect('/')
    }
}

module.exports = userAction;