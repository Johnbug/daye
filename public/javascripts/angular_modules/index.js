/**
 * Created by ziyu.zzy on 14-4-6.
 */
var app = angular.module('daye', []);


app.controller("content-box",function($scope,$http){
    var urlconfig = {
        'person' : '/followQ',
        'topic' : '/getMyTopic',
        'topic_unique' : '/questionForTopic'
    }

    $scope.state = 'person';

    function Query(url,param,scope){
        $http.get(url,{
            param : param
        }).success(function(res){
                scope.data = res.result;
            });
    }


    //$scope.records = Records.query(urlconfig[$scope.state],{});
    Query(urlconfig[$scope.state],{},$scope.records);


    //console.log($scope.records);
    $scope.changeState = function(state){
        if(state === "topic"){
            $scope.records = {};
            //$scope.topics  = Records.query(urlconfig[state],{});
            Query(urlconfig[state],{},$scope.topics);
        }else if(state === "person"){
            $scope.topics = {};
            //$scope.records = Records.query(urlconfig[$scope.state],{});
            Query(urlconfig[$scope.state],{},$scope.topics);
        }
    }

    $scope.setData = function(name){

        //$scope.topics  = Records.query(urlconfig['topic'],{});
        Query(urlconfig['topic'],{});
        //$scope.records =  Records.query(urlconfig["topic_unique"],{topicname:name});
        Query(urlconfig['topic_unique'],{topicname:name});

    }


});