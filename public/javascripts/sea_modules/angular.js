/**
 * Created by ziyu.zzy on 14-3-17.
 */
var app = angular.module('t', []);

app.controller("c",function($scope,$http){
    var url = "/angular_data";
    var user;
    $http.get(url).success(function(data, status, headers, config) {
     // data contains the response  // status is the HTTP status
     // headers is the header getter function
     // config is the object that was used to create the HTTP request
        console.log(data);
            $scope.person = data.user;
    }).error(function(data, status, headers, config) {

    });


});