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

        service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                return place;
            }
        });
    }

    getItinerariesByUserId(callback) {
        let userId = this.authService.isAuthenticated();

        firebase.database().ref('itinerary').child(userId).on('value', function(r) {
            if(r.val()) {
                callback(r.val());
                return r.val();
            }
        });
    }

}

MapsService.$inject = [
    '$rootScope',
    '$cookies',
    '$state',
    'authService',
];

export default MapsService;