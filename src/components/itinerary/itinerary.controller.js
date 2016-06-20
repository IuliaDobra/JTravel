import BaseInjectable from '../../js/BaseInjectable';

class ItineraryController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, ItineraryController.$inject);

        this.mapsService.getItinerariesByUserId((r) => {
            this.itinerary = r;
        });
    }
}

ItineraryController.$inject = [
    '$cookies',
    '$state',
    'authService',
    'mapsService'
];

export default ItineraryController;
