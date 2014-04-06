/**
 * Created by ziyu.zzy on 14-3-30.
 */
var mongodb = require('./db');

function Topic(topic) {
    this.title = topic.name;
    this.content = topic.content;
};

module.exports = Topic;

Topic.add = function(topic, callback) {
    mongodb.doMongo(function (db, pool, err) {
        if (err) {
            return callback(err);
        }
        db.collection(
            'topic', 
            function (err, collection) {
                if (err) {
                    return callback(err);
                }
                collection.find().sort({_id: -1}).toArray(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    if (result.length === 0) {
                        ide = 0;
                    }
                    else {
                        ide = result[0]._id + 1;
                    }
                    topic._id = ide;
                    collection.insert(
                        topic, 
                        {safe: true}, 
                        function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            pool.release(db);
                            return callback(err, result);
                        }
                    );
                });
            }
        );
    });
}

Topic.getAll = function(callback) {
    mongodb.doMongo(function (db, pool, err) {
        if (err) {
            return callback(err);
        }
        db.collection(
            'topic', 
            function (err, collection) {
                if (err) {
                    return callback(err);
                }
                collection.find().sort({_id: -1}).toArray(function (err, result) {
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

Topic.getMyTopic = function(user, callback) {
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
                    {name: user}, 
                    function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        db.collection(
                            'topic',
                            function (err, collection) {
                                if (err) {
                                    return callback(err);
                                }
                                var topics = [];
                                for (var i = 0, len = result.topic.length; i < len; i++) {
                                    collection.findOne(
                                        {_id: Number(result.topic[i])},
                                        function (i) {
                                            return function (err, result2) {
                                                if (err) {
                                                    return callback(err);
                                                }
                                                topics.push(result2);
                                                if (i === len - 1) {
                                                    pool.release(db);
                                                    return callback(err, topics);
                                                }
                                            }
                                        }(i)
                                    );
                                }
                            }
                        );
                    }
                );
            }
        );
    });
}

Topic.getQuestionForTopic = function(topicName, callback) {
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
                collection.find({topic: topicName}).toArray(function (err, result) {
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

Topic.getHot = function(callback){
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
                collection.find().sort({answers: -1}).toArray(function (err, result) {
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
