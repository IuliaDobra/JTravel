import BaseInjectable from '../BaseInjectable';

class MapsService extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, MapsService.$inject);
    }

    getPlaceDetailByPlaceId(id, map) {
        var service = new google.maps.places.PlacesService(map);

        var request = {
            placeId: id
        };

        service.getDetails(request, function (place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                return place;
            }
        });
    }

    getItinerariesByUserId() {
        let userId = this.authService.isAuthenticated();
        let data = [];
        let _this = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                var map = new google.maps.Map(document.getElementById('map_canvas'), {
                    zoom: 15,
                    center: {lat: position.coords.latitude, lng: position.coords.longitude},
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                firebase.database().ref('user-itinerary').child(userId).on('value', function(r) {
                    if(r.val()) {
                        angular.forEach(r.val(), function(value, key) {
                            let place = _this.getPlaceDetailByPlaceId(value, map);
                            console.log(place);
                            data.push(place);
                        });
                        return data;
                    }
                });
            });
        } else {
            this.error = "Geolocation is not supported by this browser.";
        }
    }

}

MapsService.$inject = [
    '$rootScope',
    '$cookies',
    '$state',
    'authService'
];

export default MapsService;