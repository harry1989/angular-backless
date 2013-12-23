'use strict';

/* Controllers */
var ctrlModule = angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('NavbarController', ['$scope','$location','authService',function($scope, $location, authService) {
        $scope.routeIs = function (routeName) {
             return $location.path() === routeName;
        };

        $scope.authService = authService;

    }]).controller('UserController', ['$scope','$http', '$location','authService', function($scope, $http, $location, authService){

        $scope.authenticate = function(user){
            authService.signIn(user).then(function(status){
                if(status.authenticated === true){
                    $location.path('/dashboard');
                    noty({text: 'Successfully logged in.', type:'success', layout:'topRight', timeout: 2000});
                }
                else{
                    $scope.message = status.message;
                }
            });
        };

        $scope.register = function (newUser) {
            authService.signUp(newUser).then(function(status){
                if(status.registered === true){
                    authService.signIn({email: newUser.email, password: newUser.password});
                    $location.path('/activities');
                    noty({text: 'Successfully signed up.', type:'success', layout:'topRight', timeout: 2000});
                }
                else{
                    $scope.signUpError = status.message;
                };

            });
        };

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/dashboard');
        };
    }]);

ctrlModule.controller('ActivitiesController',['$scope','Activity', 'moment','$filter','$location', function($scope, activity, moment, $filter, $location){
    var newActivity = {workoutDate: new Date(), activityType: 'Running'};
    $scope.newActivity = newActivity;
    $scope.activityTypes = ['Running', 'Walking', 'Cycling', 'Hiking', 'Swimming', 'Skating'];  //this could be pulled from the backend

    $scope.save = function(){
        activity.save({}, newActivity);
        $location.path('/dashboard');
    };

}]);

ctrlModule.controller('DashboardController', ['$scope','Activity','moment', function($scope, activity, moment){

    var stats = activity.statistics(function(response){
        //This code should be in the directive
        var data = {
            labels : _.keys(response.weeklyBurning),
            datasets : [
                {
                    fillColor : "#dd4b39",
                    strokeColor : "#dd4b39",
                    data : _.values(response.weeklyBurning)
                }
            ]
        }
        var ctx = $("#calories-chart").get(0).getContext("2d");
        var chart = new Chart(ctx).Bar(data);
    });

    $scope.pastActivities = activity.query();
    $scope.statistics = stats;


}]);
