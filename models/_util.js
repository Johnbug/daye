/**
 * Created by ziyu.zzy on 14-4-1.
 */

var mongodb = require('./db'),
    thenjs = require("thenjs");

var util = {
    getLastId : function(cell,cb){

        mongodb.doMongo(function(db,pool,err){
            if(err){
                return cb(err);
            }

            db.collection(cell,function(err,cellection){
                if(err){
                    return cb(err);
                }

                cellection.find()
                    .sort({'_id':-1})
                    .limit(1)
                    .toArray(function(err,result){

                        if(err){

                            return cb(err);
                        }
                        if(result.length == 0){
                            cb(err,0);
                        }else{
                            cb(err,result[0]._id);
                        }
                    });
            });
        });
    }
}

module.exports = util;