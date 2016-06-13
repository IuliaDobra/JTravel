import BaseInjectable from '../../js/BaseInjectable';

class ItineraryController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, ItineraryController.$inject);

        this.itinerary = this.mapsService.getItinerariesByUserId();
    }
}

ItineraryController.$inject = [
    '$cookies',
    '$state',
    'authService',
    'mapsService'
];

export default ItineraryController;
