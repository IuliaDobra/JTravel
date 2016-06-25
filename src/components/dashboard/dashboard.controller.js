import BaseInjectable from '../../js/BaseInjectable';

class DashboardController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, DashboardController.$inject);

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        this.getLocation();
        this.databaseVector = [];

        this.travelMode = google.maps.TravelMode.WALKING;
        this.travelModes = {
            walking: google.maps.TravelMode.WALKING,
            transit: google.maps.TravelMode.TRANSIT,
            driving: google.maps.TravelMode.DRIVING
        }

        this.database = firebase.database();
        this.place = null;

        this.startDate = null;
        this.endDate = null;

        $('button').click(function() {
            $(this).toggleClass('expanded').siblings('div').slideToggle();
        });

        this.isAuth();
    }
    
    
    isAuth() {
        var userId = this.authService.isAuthenticated();
        if(!userId) {
            this.$state.go('login');
        }
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.position = position;
                this.map = new google.maps.Map(document.getElementById('map_canvas'), {
                    zoom: 15,
                    center: {lat: this.position.coords.latitude, lng: this.position.coords.longitude},
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                if(this.$cookies.get('isEdit')) {
                    this.setItineraryOnMap();
                }
                this.setRouteDirections();

            });
        } else {
            this.error = "Geolocation is not supported by this browser.";
        }
    }

    route(directionsService, directionsDisplay) {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        directionsService.route({
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setPanel(document.getElementById('directionsList'));
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    };

    setMapControls(map) {
        this.originInput = document.getElementById('origin-input');
        this.destinationPlaceInput = document.getElementById('destination-input');
        this.modes = document.getElementById('mode-selector');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.originInput);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.destinationPlaceInput);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.modes);
    };

    expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    };

    setupClickListener(id, mode) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', () => {
            this.travelMode = mode;
        });
    };

    setRouteDirections() {
        var _this = this;
        if(!this.originPlaceId) {
            this.originPlaceId = null;
        }
        this.originPlaceName = null;
        if(!this.destinationPlaceId) {
            this.destinationPlaceId = null;
        }
        this.destinationPlaceName = null;
        this.travelMode = google.maps.TravelMode.WALKING;
        this.directionsDisplay.setMap(this.map);

        this.setMapControls(this.map);

        this.setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
        this.setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
        this.setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

        this.originAutocomplete = new google.maps.places.Autocomplete(this.originInput);
        this.originAutocomplete.bindTo('bounds', this.map);
        this.originAutocomplete.addListener('place_changed', function() {
            var place = this.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            _this.expandViewportToFitPlace(_this.map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            _this.originPlaceId = place.place_id;
            _this.originPlaceName = place.name;
            _this.route(_this.directionsService, _this.directionsDisplay);
        });

        this.destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationPlaceInput);
        this.destinationAutocomplete.bindTo('bounds',this.map);
        this.destinationAutocomplete.addListener('place_changed', function() {
            var place = this.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            _this.expandViewportToFitPlace(_this.map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            _this.destinationPlaceId = place.place_id;
            _this.destinationPlaceName = place.name;
            _this.route(_this.directionsService, _this.directionsDisplay);

            _this.searchNearbyPlaces(place.geometry.location, 25000, ['museum']);
        });
    };

    searchNearbyPlaces(location, radius, type) {
        var request = {
            location: location,
            radius: radius,
            types: type
        };
        var _this = this;
        var service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    // If the request succeeds, draw the place location on
                    // the map as a marker, and register an event to handle a
                    // click on the marker.
                    _this.setMarker(place.place_id);
                }
            }
        });
    };

    setMarker(placeId) {
        var _map = this.map;
        var _this = this;

        var request = {
            placeId: placeId
        };

        var service = new google.maps.places.PlacesService(_map);
        var infowindow = new google.maps.InfoWindow();

        service.getDetails(request, function (place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                // If the request succeeds, draw the place location on the map
                // as a marker, and register an event to handle a click on the marker.
                var marker = new google.maps.Marker({
                    map: _map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function() {
                    var HTML = '';
                    HTML +=
                        '<div ng-controller="DashboardController">' +
                        '   <strong>' + place.name + '</strong><br>' +
                            place.formatted_address + '<br><br>' +
                            '<button class="btn btn-primary" data-id="' + place.place_id + '" id="add-place-to-itinerary-button-' + place.place_id + '">Add to itinerary</button>' +
                        '</div>';

                    $(document).ready(function() {
                       $(document).on('click', '#add-place-to-itinerary-button-' + place.place_id, function() {
                           var placeId = $(this).data('id');
                           _this.addPlaceToItinerary(placeId);
                       });
                    });

                    infowindow.setContent(HTML);
                    infowindow.open(_map, this);
                });

                _map.panTo(place.geometry.location);
            }
        });
    }

    //putPlaceInDb(placeId) {
    //    var userId = this.authService.isAuthenticated();
    //    this.mapsService.getPlaceDetailByPlaceId(placeId, this.map);
    //    firebase.database().ref('places').orderByValue().equalTo(placeId).on('value', function(snapshot) {
    //        if(!snapshot.val()) {
    //            var newPlaceKey = firebase.database().ref().child('places').push().key;
    //            var updates = {};
    //            updates['/places/' + newPlaceKey] = placeId;
    //            updates['/user-places/' + userId + '/' + newPlaceKey] = placeId;
    //
    //            return firebase.database().ref().update(updates);
    //        }
    //    });
    //}

    addPlaceToItinerary(placeId) {
        var userId = this.authService.isAuthenticated();
        var itineraryId = this.$cookies.get('itinerary_key');
        var service = new google.maps.places.PlacesService(this.map);

        var request = {
            placeId: placeId
        };

        service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                firebase.database().ref('itinerary').child(userId).child(itineraryId).child('places').orderByKey().equalTo(placeId).once('value', function(snapshot) {
                    if(!snapshot.val()) {
                        var updates = {};
                        var placeDetailsUpdate = {};
                        if(!!place.opening_hours) {
                            var open_now = place.opening_hours.open_now;
                        } else {
                            var open_now = false;
                        }
                        var openingHours = {
                            open_now: open_now
                        };
                        var photos = {};
                        var review = {};
                        var placeDetails = {
                            placeId: placeId
                        };

                        if(!!place.name) {
                            placeDetails['name'] = place.name;
                        }

                        if(!!place.rating) {
                            placeDetails['rating'] = place.rating;
                        }

                        if(!!place.formatted_address) {
                            placeDetails['formatted_address'] = place.formatted_address;
                        }

                        if(!!place.formatted_phone_number) {
                            placeDetails['formatted_phone_number'] = place.formatted_phone_number;
                        }

                        if(!!place.url) {
                            placeDetails['url'] = place.url;
                        }

                        if(!!place.website) {
                            placeDetails['website'] = place.website;
                        }

                        if(!!place.opening_hours) {
                            if(!!place.opening_hours.weekday_text) {
                                $.each(place.opening_hours.weekday_text, function(index, value) {
                                    var newOpeningHoursKey = firebase.database().ref('itinerary').child(userId).child(itineraryId).child('places').child('openingHours').push().key;
                                    updates['/itinerary/' + userId + '/' + itineraryId + '/places/' + placeId + '/openingHours/' + newOpeningHoursKey ] = value;
                                });
                            }
                        }
                        console.log(place);
                        if(!!place.photos) {
                            var value = place.photos[0];
                            //$.each(place.photos, function(index, value) {
                                var img = value.getUrl({
                                    'maxWidth': value.width,
                                    'maxHeight': value.height
                                });
                                //var newPhotosKey = firebase.database().ref('itinerary').child(userId).child(itineraryId).child('places').child('photos').push().key;
                                updates['/itinerary/' + userId + '/' + itineraryId + '/places/' + placeId + '/photo' ] = img;
                            //});
                        }

                        if(!!place.reviews) {
                            $.each(place.reviews, function (index, value) {
                                review = {};
                                if(!!value.author_name) {
                                    review['author_name'] = value.author_name;
                                }

                                if(!!value.author_url) {
                                    review['author_url'] = value.author_url;
                                }

                                if(!!value.language) {
                                    review['language'] = value.language;
                                }

                                if(!!value.profile_photo_url) {
                                    review['profile_photo_url'] = value.profile_photo_url;
                                }

                                if(!!value.rating) {
                                    review['rating'] = value.rating;
                                }

                                if(!!value.text) {
                                    review['text'] = value.text;
                                }

                                if(!!value.time) {
                                    review['time'] = value.time;
                                }

                                var newReviewsKey = firebase.database().ref('itinerary').child(userId).child(itineraryId).child('places').child('reviews').push().key;
                                updates['/itinerary/' + userId + '/' + itineraryId + '/places/' + placeId + '/reviews/' + newReviewsKey ] = review;
                            });
                        }

                        placeDetailsUpdate['/itinerary/' + userId + '/' + itineraryId + '/places/' + placeId] = placeDetails;

                        firebase.database().ref().update(placeDetailsUpdate);
                        firebase.database().ref().update(updates);
                    } else {
                        console.log('place already in itinerary');
                    }
                });
            }
        });
    }

    getPlaceDetailByPlaceId(id, map) {
        var service = new google.maps.places.PlacesService(map);

        var request = {
            placeId: id
        };

        service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                return place;
            }
        });
    }

    createItinerary() {
        var userId = this.authService.isAuthenticated();
        var newItineraryKey = firebase.database().ref('itinerary').child(userId).push().key;
        var updates = {};
        updates['/itinerary/' + userId + '/' + newItineraryKey] = {
            originPlaceId: this.originPlaceId,
            originPlaceName: this.originPlaceName,
            destinationPlaceId: this.destinationPlaceId,
            destinationPlaceName: this.destinationPlaceName,
            startDate: this.startDate,
            endDate: this.endDate,
            enabled: 1,
            places: false
        };

        window.alert("You just started a new itinerary");
        this.$cookies.put('itinerary_key', newItineraryKey);

        return firebase.database().ref().update(updates);
    }

    finishItinerary() {
        var userId = this.authService.isAuthenticated();
        var itineraryId = this.$cookies.get('itinerary_key');

        this.$cookies.remove('isEdit');
        this.$cookies.remove('startDate');
        this.$cookies.remove('endDate');
        this.$cookies.remove('destinationPlaceId');
        this.$cookies.remove('originPlaceId');
        this.$cookies.remove('itinerary_key');

        firebase.database().ref('itinerary/' + userId + '/' + itineraryId).update({
            enabled: 0
        });
    }

    setItineraryOnMap() {
        this.originPlaceId = this.$cookies.get('originPlaceId');
        this.destinationPlaceId = this.$cookies.get('destinationPlaceId');

        this.startDate = this.$cookies.get('startDate');
        this.endDate = this.$cookies.get('endDate');

        this.route(this.directionsService, this.directionsDisplay);

        var service = new google.maps.places.PlacesService(this.map);

        var request = {
            placeId: this.destinationPlaceId
        };

        service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                this.searchNearbyPlaces(place.geometry.location, 25000, ['museum']);
            }
        });
    }


}

DashboardController.$inject = [
    '$scope',
    '$compile',
    '$cookies',
    'authService',
    'mapsService',
    'datepickerService',
    '$state'
];

export default DashboardController;
