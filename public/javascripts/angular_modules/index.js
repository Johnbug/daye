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

    function QueryRecords(url,param){
        console.log(param);
        $http.get(url,{
            params : param
        }).success(function(res){
                $scope.records = res.result;
            });
    }

    function QueryTopics(url,param){
        $http.get(url,{
            params:param
        }).success(function(res){
                $scope.topics = res.result;
            });
    }

    //$scope.records = Records.query(urlconfig[$scope.state],{});
    QueryRecords(urlconfig[$scope.state],{});


    //console.log($scope.records);
    $scope.changeState = function(state){
        if(state === "topic"){
            $scope.records = {};
            //$scope.topics  = Records.query(urlconfig[state],{});
            QueryTopics(urlconfig[state],{});
        }else if(state === "person"){
            $scope.topics = {};
            //$scope.records = Records.query(urlconfig[$scope.state],{});
            QueryRecords(urlconfig[$scope.state],{});
        }
    }

    $scope.setData = function(name){
        console.log(name);
        QueryRecords(urlconfig['topic_unique'],{topicName:name});
    }


});