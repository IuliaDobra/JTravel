'use strict';

angular.module('myApp.map', [])
    .controller('MapCtrl',
        function($scope, $log, $timeout) {
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    $scope.$apply(function () {
                        $scope.position = position;
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

                        $scope.route = function (origin_place_id, destination_place_id, travel_mode,
                                                 directionsService, directionsDisplay) {
                            if (!origin_place_id || !destination_place_id) {
                                return;
                            }
                            directionsService.route({
                                origin: {'placeId': origin_place_id},
                                destination: {'placeId': destination_place_id},
                                travelMode: travel_mode
                            }, function(response, status) {
                                if (status === google.maps.DirectionsStatus.OK) {
                                    directionsDisplay.setDirections(response);
                                    console.log($scope.map);
                                    //directionsDisplay.setMap($scope.map.control.getGMap());
                                    directionsDisplay.setPanel(document.getElementById('directionsList'));
                                    $scope.showList = true;
                                } else {
                                    window.alert('Directions request failed due to ' + status);
                                }
                            });
                        };

                        var origin_place_id = null;
                        var destination_place_id = null;
                        var travel_mode = google.maps.TravelMode.WALKING;
                        directionsDisplay.setMap($scope.map);

                        var origin_input = document.getElementById('origin-input');
                        var destination_input = document.getElementById('destination-input');
                        var modes = document.getElementById('mode-selector');

                        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
                        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
                        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

                        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
                        origin_autocomplete.bindTo('bounds', $scope.map);
                        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
                        destination_autocomplete.bindTo('bounds',$scope.map);

                        // Sets a listener on a radio button to change the filter type on Places
                        // Autocomplete.
                        $scope.setupClickListener = function (id, mode) {
                            var radioButton = document.getElementById(id);
                            radioButton.addEventListener('click', function() {
                                travel_mode = mode;
                            });
                        };
                        $scope.setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
                        $scope.setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
                        $scope.setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

                        $scope.expandViewportToFitPlace = function (map, place) {
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);
                            }
                        };

                        origin_autocomplete.addListener('place_changed', function() {
                            var place = origin_autocomplete.getPlace();
                            if (!place.geometry) {
                                window.alert("Autocomplete's returned place contains no geometry");
                                return;
                            }
                            $scope.expandViewportToFitPlace($scope.map, place);

                            // If the place has a geometry, store its place ID and route if we have
                            // the other place ID
                            origin_place_id = place.place_id;
                            $scope.route(origin_place_id, destination_place_id, travel_mode,
                                directionsService, directionsDisplay);
                        });

                        destination_autocomplete.addListener('place_changed', function() {
                            var place = destination_autocomplete.getPlace();
                            if (!place.geometry) {
                                window.alert("Autocomplete's returned place contains no geometry");
                                return;
                            }
                            $scope.expandViewportToFitPlace($scope.map, place);

                            // If the place has a geometry, store its place ID and route if we have
                            // the other place ID
                            destination_place_id = place.place_id;
                            $scope.route(origin_place_id, destination_place_id, travel_mode,
                                directionsService, directionsDisplay);
                        });

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

            } else {
                $scope.map = new google.maps.Map(document.getElementById('map_canvas'), {
                    zoom: 15,
                    center: {lat: position.coords.latitude, lng: position.coords.longitude},
                    mapTypeControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }
        });