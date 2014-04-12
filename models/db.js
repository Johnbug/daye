/**
 * Created by jonbug on 13-12-8.
 */
var settings = require('../settings'),
    /*
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
    module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}), {safe: true});
    */

    /*
    使用generic-pool来解决连接池的问题，并且封装连接数据库的方法。
     */
    MongoClient = require('mongodb').MongoClient,
    poolModule = require('generic-pool');

    var pool = poolModule.Pool({
        name     : 'mongodb',
        create   : function(callback) {
            MongoClient.connect('mongodb://'+settings.host+':27017/'+settings.db, {
                server:{poolSize:1}
            }, function(err,db){
                callback(err,db);
            });
        },
        destroy  : function(db) { db.close(); },
        max      : 10,//根据应用的可能最高并发数设置
        idleTimeoutMillis : 30000,
        log : false
    });

    exports.doMongo = function(callback){
        pool.acquire(function(err, db) {
            if (err) {

                //more code...
            } else {

                callback(db,pool,err);
            }
        });
    }