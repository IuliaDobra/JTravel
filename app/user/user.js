'use strict';

angular.module('myApp.user', [])
    .controller("UserCtrl", ["$scope", "$cookies", "$location", "$route",
        function($scope, $cookies, $location, $route) {
            var ref = new Firebase("https://jtravel.firebaseio.com");

            $scope.createUser = function() {
                ref.createUser({
                    email    : $scope.createEmail,
                    password : $scope.createPassword
                }, function(error, userData) {
                    if (error) {
                        console.log("Error creating user:", error);
                    } else {
                        console.log("Successfully created user account with uid:", userData.uid);
                    }
                });
            }

            $scope.authUser = function() {
                ref.authWithPassword({
                    email    : $scope.authEmail,
                    password : $scope.authPassword
                }, function(error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                        $cookies.put('uid', authData.uid);
                        $route.reload();
                    }
                });
            }

            $scope.logout = function() {
                $cookies.remove('uid');
                $location.path('/user');
            }

            $scope.isAuthenticated = function() {
                if($cookies.get('uid')) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);