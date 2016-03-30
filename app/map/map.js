'use strict';

angular.module('myApp.map', [])
    .controller('MapCtrl',
        function($scope, $log, $timeout) {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    $scope.$apply(function () {
                        $scope.position = position;
                        console.log(position.coords.latitude, position.coords.longitude);
                        $scope.map = new google.maps.Map(document.getElementById('map_canvas'), {
                            zoom: 15,
                            center: {lat: position.coords.latitude, lng: position.coords.longitude},
                            mapTypeControl: true,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });

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

                                    $scope.marker = new google.maps.Marker({
                                        map: $scope.map,
                                        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                                        title: 'You are here'
                                    });
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
        });