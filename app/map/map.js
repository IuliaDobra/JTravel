/**
 * Created by alexandru-coman on 22/12/15.
 */

'use strict';

angular.module('myApp.map', [])
    .controller('MapCtrl',
        function($scope, $log, $timeout) {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    $scope.$apply(function () {
                        $scope.position = position;
                        console.log(position);
                        $scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 15 };
                        $scope.coordsUpdates = 0;
                        $scope.dynamicMoveCtr = 0;
                        $scope.marker = {
                            id: 0,
                            coords: {
                                latitude: $scope.position.latitude,
                                longitude: $scope.position.longitude
                            },
                            options: { draggable: true },
                            events: {
                                dragend: function (marker, eventName, args) {
                                    $log.log('marker dragend');
                                    var lat = marker.getPosition().lat();
                                    var lon = marker.getPosition().lng();
                                    $log.log(lat);
                                    $log.log(lon);

                                    $scope.marker.options = {
                                        draggable: true,
                                        labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                                        labelAnchor: "100 0",
                                        labelClass: "marker-labels"
                                    };
                                }
                            }
                        };
                        $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
                            if (_.isEqual(newVal, oldVal))
                                return;
                            $scope.coordsUpdates++;
                        });
                        $timeout(function () {
                            $scope.marker.coords = {
                                latitude: $scope.position.coords.latitude,
                                longitude: $scope.position.coords.longitude
                            };
                            $scope.dynamicMoveCtr++;
                            $timeout(function () {
                                $scope.marker.coords = {
                                    latitude: $scope.position.coords.latitude,
                                    longitude: $scope.position.coords.longitude
                                };
                                $scope.dynamicMoveCtr++;
                            }, 2000);
                        }, 1000);
                    })
                });

            }
            else {
                $scope.map = {center: {latitude: 45, longitude: -35}, zoom: 8};
            }
    });