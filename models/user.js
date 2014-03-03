/**
 * Created by jonbug on 13-12-8.
 */
var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;

User.prototype.save = function(callback) {//存储用户信息
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password
    };
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //读取 users 集合
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将用户数据插入 users 集合
            collection.insert(user,{safe: true}, function(err, user){
                mongodb.close();
                callback(err, user);//成功！返回插入的用户信息
            });
        });
    });
};

User.get = function(name, callback){//读取用户信息
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //读取 users 集合
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找用户名 name 值为 name文档
            collection.findOne({
                name: name
            },function(err, doc){
                mongodb.close();
                if(doc){
                    var user = new User(doc);
                    callback(err, user);//成功！返回查询的用户信息
                } else {
                    callback(err, null);//失败！返回null
                }
            });
        });
    });
};

User.list = function(q,callback){
    mongodb.open(function(err,db){
       if(err){
           mongodb.close();
           return callback(err);
       }
       db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
           collection.find(function(err, cursor) {
               cursor.toArray(function(err, items) {
                   if(err){
                       return callback(err,null);
                   }else{
                       var res = [];
                       for(var i in items){
                           res.push(items[i][q]);
                       }
                       return callback(err,res);
                   }
               });
           });
        });
    });
}

User.ask = function(ask, callback){
    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('question', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(ask, {safe: true}, function(err, result){
                mongodb.close();
                callback(err, result);
            });
        });
    });
}

User.getQuestion = function(callback){
    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection("question", function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find().sort({time: -1}).toArray(function(err, items){
                mongodb.close();
                return callback(items);
            });
        })
    })
}

