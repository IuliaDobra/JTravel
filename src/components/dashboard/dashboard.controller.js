import BaseInjectable from '../../js/BaseInjectable';

class DashboardController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, DashboardController.$inject);

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        this.getLocation();

        this.travelMode = google.maps.TravelMode.WALKING;
        this.travelModes = {
            walking: google.maps.TravelMode.WALKING,
            transit: google.maps.TravelMode.TRANSIT,
            driving: google.maps.TravelMode.DRIVING
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
        this.originPlaceId = null;
        this.destinationPlaceId = null;
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
            _this.route(_this.directionsService, _this.directionsDisplay);
        });
    };


}

DashboardController.$inject = [
    '$scope'
];

export default DashboardController;
