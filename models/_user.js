/**
 * Created by ziyu.zzy on 14-4-1.
 */
var  mongodb = require('./db'),
    thenjs = require('thenjs'),
    _util = require('./_util');

function User(u){
    this._id = u._id;
    this.username = u.username;
    this.password = u.password;
    this.info = u.info;
    this.q = u.q;
    this.a = u.a;
    this.t = u.t;
}

User.prototype = {
    constructor : User,
    init : function(cb){

        var _this = this;
        if(this._id === undefined){
            _util.getLastId('users',function(err,id){

                if(err) throw(err)
                _this._id = id+1;

            if(_this.info === undefined){
                _this.info = {
                    "gender" : true, //默认男生
                    "major" : 'CS',
                    "signature" : "",
                    "time":new Date()
                }
            }

            if(_this.q === undefined){
                _this.q = {
                    "ask" : [],
                    "look" : [],
                    'good' : [],
                    'bad' : []
                }
            }

            if(_this.a === undefined){
                _this.a = {
                    "answer" : [],
                    "collect" :[],
                    "agree" : [],
                    "object" : []
                }
            }

            if(_this.u === undefined){
                _this.u = {
                    "follow" :[],
                    "followed" :[]
                }
            }

            if(_this.t === undefined){
                _this.t = {
                    "follow" : []
                }
            }
            cb();
            })
        }
    },
    save : function(cb){
        var _this = this;

        this.init(function(){

        var u = {};
        u._id = _this._id;

        u.username = _this.username;
        u.password = _this.password;
        u.info = _this.info;
        u.q = _this.q;
        u.a = _this.a;
        u.t = _this.t;

        mongodb.doMongo(function(db,pool,err){
            if(err){
                return cb(err);
            }
            db.collection('users', function(err, collection){
                if(err){
                    return cb(err);
                }
                //将用户数据插入 users 集合
                collection.insert(u,{safe: true}, function(err, u){

                    cb(err, u);//成功！返回插入的用户信息
                    pool.release(db);
                });
            });
        });
        });
    }
}

User.getUser = function(name, callback){//读取用户信息
    //打开数据库

    mongodb.doMongo(function(db,pool,err){
        if(err){
            return callback(err);
        }

        thenjs(function(defer){
            db.collection('users',function(err,collection){

                defer(err,collection);
            });
        })
            .then(function(defer,collection){

                collection.findOne({
                    username:name
                },function(err,doc){

                    defer(err,doc);
                })
            },function(defer,err){
                callback(err);
            })
            .then(function(err,doc){
                pool.release(db);

                if(doc){
                    var user = new User(doc);

                    callback(err, user);//成功！返回查询的用户信息
                } else {
                    callback(err, null);//失败！返回null
                }
            })
    })
};

User.info = function(name, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("users", function(err, collection){
            if(err){
                return callback(err);
            }
            collection.findOne({username: name}, function(err, result){
                if(err){
                    return callback(err);
                }
                pool.release(db);
                return callback(err, result);
            });
        });
    });
}





module.exports = User;
