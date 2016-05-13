'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.map',
    'myApp.user',
    'myApp.version',
    'uiGmapgoogle-maps',
    'firebase',
    'ngCookies'
])
.run(function ($cookies, $location) {
    if($cookies.get('uid') == undefined) {
        $location.path('/user');
    } else {
        $location.path('/map');
    }
})
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/login'});

    $routeProvider.when('/map', {
        templateUrl: 'map/map.html',
        controller: 'MapCtrl'
    });

    $routeProvider.when('/user', {
        templateUrl: 'user/user.html',
        controller: 'UserCtrl'
    });
}])
.constant('googleApiKey','AIzaSyCRQsSraulm6n1oll1RMvxdrROsExL6jVA');
