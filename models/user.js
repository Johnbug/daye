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

    mongodb.doMongo(function(db,pool,err){
        if(err){
            return callback(err);
        }
        db.collection('users', function(err, collection){
            if(err){
                return callback(err);
            }
            //将用户数据插入 users 集合
            collection.insert(user,{safe: true}, function(err, user){
                callback(err, user);//成功！返回插入的用户信息
                pool.release(db);
            });
        });
    });
};

User.get = function(name, callback){//读取用户信息
    //打开数据库

    mongodb.doMongo(function(db,pool,err){
        if(err){
            return callback(err);
        }
        //读取 users 集合
        db.collection('users', function(err, collection){
            if(err){
                return callback(err);
            }
            //查找用户名 name 值为 name文档
            collection.findOne({
                name: name
            },function(err, doc){
                pool.release(db);
                if(doc){
                    var user = new User(doc);
                    callback(err, user);//成功！返回查询的用户信息
                } else {
                    callback(err, null);//失败！返回null
                }
            });
        });
    })
};

User.list = function(q,callback){
    mongodb.doMongo(function(db,pool,err){
       if(err){

           return callback(err);
       }
       db.collection('users',function(err,collection){
            if(err){
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
               pool.release(db);
           });
        });
    });
}

User.ask = function(ask, callback){
    mongodb.doMongo(function( db,pool,err){
        if(err){

            return callback(err);
        }
        db.collection('question', function(err, collection){
            if(err){

                return callback(err);
            }
<<<<<<< HEAD
            collection.find().sort({time: -1}).toArray(function(err, result){
                if(result.length === 0){
                    ide = 0;
                }else{
                    ide = result[0]._id + 1;
                }
                ask._id = ide;
                collection.insert(ask, {safe: true}, function(err, result){
                    mongodb.close();
                    callback(err, result);
                });
=======
            collection.insert(ask, {safe: true}, function(err, result){

                callback(err, result);
                pool.release(db);
>>>>>>> 6d4a3a04fc16b2623e9342f5d17cb726e69651bc
            });
        });
    });
}

User.getQuestion = function(callback){
    mongodb.doMongo(function(db,pool,err){
        if(err){

            return callback(err);
        }
        db.collection("question", function(err, collection){
            if(err){

                return callback(err);
            }
            collection.find().sort({time: -1}).toArray(function(err, items){
<<<<<<< HEAD
                mongodb.close();
                return callback(err, items);
            });
        });
    });
}

User.findQuestion = function(id, callback){
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
            collection.findOne({_id: Number(id)}, function(err, result){
                if(err){
                    mongodb.close();
                    return callback(err);
                }else{
                    mongodb.close();
                    return callback(err, result);
                }
            });
        });
    });
=======

                return callback(items);
            });
            pool.release(db);
        })
    })
>>>>>>> 6d4a3a04fc16b2623e9342f5d17cb726e69651bc
}

User.answer = function(id, answer, callback){
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
            collection.findOne({_id: Number(id)}, function(err, result){
                answer.num = result.answer.length;
                collection.update({_id: Number(id)}, {$push: {answer: answer}}, function(err, result){
                    if(err){
                        mongodb.close();
                        return callback(err);
                    }else{
                        mongodb.close();
                        return callback(err, result);
                    }
                });
            });
        });
    });
}

User.vote = function(id, num, vote, callback){
    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection("question", function(err, collection){
            var attr;
            if(err){
                mongodb.close();
                return callback(err);
            }
            if(vote > 0){
                collection.update({_id: Number(id), "answer.num": Number(num)}, {$inc: {"answer.$.up": 1}}, function(){});
                collection.findOne({_id: Number(id)}, function(err, result){
                   if(err){
                        mongodb.close();
                        return callback(err);
                    }else{
                        mongodb.close();
                        return callback(err, result);
                    }
                });
            }else{
                collection.update({_id: Number(id), "answer.num": Number(num)}, {$inc: {"answer.$.down": 1}}, function(){});
                collection.findOne({_id: Number(id)}, function(err, result){
                   if(err){
                        mongodb.close();
                        return callback(err);
                    }else{
                        mongodb.close();
                        return callback(err, result);
                    }
                });
            }
        });
    });
}
