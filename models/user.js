/**
 * Created by jonbug on 13-12-8.
 */
var mongodb = require('./db'),
    thenjs = require("thenjs");

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.sex = user.sex;
    this.major = user.major;
    this.signature = user.signature;
    this.level = user.level;
    this.follow = user.follow||new Array();
    this.followed = user.followed||new Array();
};

module.exports = User;

User.prototype.save = function(callback) {//存储用户信息
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        sex: this.sex,
        major: this.major,
        signature: this.signature,
        level: this.level,
        follow : this.follow,
        followed : this.followed
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
        /*
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
        */
        //thenjs 异步编程，减少回调嵌套，而改用链式，易于代码维护
        //此branch用于测试thenjs
        thenjs(function(defer){
            db.collection('users',function(err,collection){
                //console.log(collection);
                defer(err,collection);
            });
        })
            .then(function(defer,collection){
                //console.log()
                collection.findOne({
                    name:name
                },function(err,doc){
                    //console.log(doc);
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
            collection.find().sort({time: -1}).toArray(function(err, result){
                if(result.length === 0){
                    ide = 0;
                }else{
                    ide = result[0]._id + 1;
                }
                ask._id = ide;
                // collection.insert(ask, {safe: true}, function(err, result){
                //     mongodb.close();
                //     callback(err, result);
                // });
                collection.insert(ask, {safe: true}, function(err, result){
                      callback(err, result);
                      pool.release(db);
                });
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

                pool.release(db);
                return callback(err, items);
            });
        });
    });
}

User.findQuestion = function(id, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("question", function(err, collection){
            if(err){
                return callback(err);
            }
            collection.findOne({_id: Number(id)}, function(err, result){
                if(err){
                    return callback(err);
                }
                pool.release(db);
                return callback(err, result);
            });
        });
    });

}

User.answer = function(id, answer, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("question", function(err, collection){
            if(err){
                return callback(err);
            }
            collection.findOne({_id: Number(id)}, function(err, result){
                answer.num = result.answer.length;
                collection.update({_id: Number(id)}, {$push: {answer: answer}, $inc: {answers: 1}}, function(err, result){
                    if(err){
                        return callback(err);
                    }
                    pool.release(db);
                    return callback(err, result);
                });
            });
        });
    });
}

User.vote = function(id, num, vote, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("question", function(err, collection){
            var attr;
            if(err){
                return callback(err);
            }
            if(vote > 0){
                collection.update({_id: Number(id), "answer.num": Number(num)}, {$inc: {"answer.$.up": 1}}, function(){});
                collection.findOne({_id: Number(id)}, function(err, result){
                   if(err){
                        return callback(err);
                    }
                    pool.release(db);
                    return callback(err, result);
                });
            }else{
                collection.update({_id: Number(id), "answer.num": Number(num)}, {$inc: {"answer.$.down": 1}}, function(){});
                collection.findOne({_id: Number(id)}, function(err, result){
                   if(err){
                        return callback(err);
                    }
                    pool.release(db);
                    return callback(err, result);
                });
            }
        });
    });
}

User.info = function(name, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("users", function(err, collection){
            if(err){
                return callback(err);
            }
            collection.findOne({name: name}, function(err, result){
                if(err){
                    return callback(err);
                }
                pool.release(db);
                return callback(err, result);
            });
        });
    });
}

//获得用户的所有提问
User.getUserQuestion = function(name, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("question", function(err, collection){
            if(err){
                return callback(err);
            }
            collection.find({user: name}).sort({time: -1}).toArray(function(err, result){
                if(err){
                    return callback(err);
                }
                pool.release(db);
                return callback(err, result);
            });
        }); 
    });
}

//获得用户的所有回答
User.getUserAnswer = function(name, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("question", function(err, collection){
            if(err){
                return callback(err);
            }
            collection.find({"answer.user": name}).sort({time: -1}).toArray(function(err, result){
                if(err){
                    return callback(err);
                }
                pool.release(db);
                return callback(err, result);
            });
        });
    });
}

//编辑用户信息
User.editUser =function(user, callback){
    mongodb.doMongo(function(db, pool, err){
        if(err){
            return callback(err);
        }
        db.collection("users", function(err, collection){
            if(err){
                return callback(err);
            }
            //console.log(user);
            collection.findOne({name: user.name}, function(err, result){ 
                if(err){
                    return callback(err);
                } 
                result.sex = user.sex;
                result.major = user.major;
                result.signature = user.signature;
                //console.log(result);
                collection.save(result, function(err, items){
                    if(err){
                        return callback(err);
                    }
                    pool.release(db);
                    return callback(err, items);
                });
            });
        });
    })
}

//收藏问题
User.collect = function (id, user, callback) {
    mongodb.doMongo(function (db, pool, err) {
        if (err) {
            return callback(err);
        }
        db.collection(
            "question",
            function (err, collection) {
                if (err) {
                    return callback(err);
                }
                collection.findOne(
                    {_id: Number(id)},
                    function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        if (!result.collector) {
                            result.collector = [];
                        }
                        for (var i = 0; i < result.collector.length; i++) {
                            if (result.collector[i] === user) {
                                break;
                            }
                        }
                        if (i === result.collector.length) {
                            result.collector.push(user);
                        }
                        collection.update(
                            {_id: Number(id)},
                            result,
                            function (err, item) {
                                if (err) {
                                    return callback(err);
                                }
                                pool.release(db);
                                return callback(err, item);
                            }
                        );
                    }
                );
            }
        );
    });
}

//取消收藏
User.uncollect = function (id, user, callback) {
    mongodb.doMongo(function (db, pool, err) {
        if (err) {
            return callback(err);
        }
        db.collection(
            "question",
            function (err, collection) {
                if (err) {
                    return callback(err);
                }
                collection.findOne(
                    {_id: Number(id)},
                    function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        if (!result.collector) {
                            result.collector = [];
                        }
                        for (var i = 0; i < result.collector.length; i++) {
                            if (result.collector[i] === user) {
                                result.collector.splice(i, 1);
                            }
                        }
                        collection.update(
                            {_id: Number(id)},
                            result,
                            function (err, item) {
                                if (err) {
                                    return callback(err);
                                }
                                pool.release(db);
                                return callback(err, item);
                            }
                        );
                    }
                );
            }
        );
    });
}

//收藏夹展示
User.collection = function (user, callback) {
    mongodb.doMongo(function (db, pool, err) {
        if (err) {
            return callback(err);
        }
        db.collection(
            'question',
            function (err, collection) {
                if (err) {
                    return callback(err);
                }
                collection.find({collector: user}).toArray(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    pool.release(db);
                    return callback(err, result);
                });
            }
        );
    });
}

User.updateUser = function(user,cb){
    mongodb.doMongo(function(db,pool,err){
       if(err) return cb(err);
       db.collection(
           'users',
           function(err,collection){
               if(err) return cb(err);
               collection.update({name:user.name},user,function(err){
                   if(err) return cb(err,'err');
                   else return cb(err,'suc');
               })
           }
       )
    });
}

User.getFollowees = function(user,cb){
    mongodb.doMongo(function(db,pool,err){
        if(err) return cb(err);
        var q = {"$in":user.follow};
        //console.log(q);
        db.collection(
            'users',
            function(err,collection){
                if(err) return cb(err);
                collection.find({'name': q}).toArray(function(err,result){
                   if(err) return cb(err,null);
                   else return cb(err,result);
                });
            }
        )


    });
}

User.getFollowers = function(user,cb){
    mongodb.doMongo(function(db,pool,err){
        if(err) return cb(err);
        var q = {"$in":user.followed};
        //console.log(q);
        db.collection(
            'users',
            function(err,collection){
                if(err) return cb(err);
                collection.find({'name': q}).toArray(function(err,result){
                    if(err) return cb(err,null);
                    else return cb(err,result);
                });
            }
        )


    });
}



//关注或者取消话题
User.addTopic = function (user, callback) {
    mongodb.doMongo(function (db, pool, err) {
        if (err) {
            return callback(err);
        }
        db.collection(
            'users',
            function (err, collection) {
                if (err) {
                    return callback(err);
                }
                collection.findOne(
                    {name: user.name},
                    function (err, result) {
                        var flag = true;
                        if (err) {
                            return callback(err);
                        }
                        if (!result.topic) {
                            result.topic = [];
                        }
                        for (var i = 0; i < result.topic.length; i++) {
                            if (result.topic[i] === user.topicId) {
                                result.topic.splice(i, 1);
                                flag = false;
                            }
                        }
                        if (flag) {
                            result.topic.push(user.topicId);
                        }
                        collection.update(
                            {name: user.name},
                            result,
                            function (err, item) {
                                if (err) {
                                    return callback(err);
                                }
                                pool.release(db);
                                return callback(err, item);
                            }
                        );
                    }
                );
            }
        );
    });
}

User.getUserFollowQuestion = function(user,cb){
    mongodb.doMongo(function(db,pool,err){
        if(err){
            return cb(err);
        }
        var q = {"$in":user.follow};
        db.collection('question',function(err,collection){
            if(err){
                return cb(err);
            }

            collection.find({'user':q}).toArray(function(err,result){
                if(err) cb(err,null);
                else cb(err,result);
            });
        })
    });
}