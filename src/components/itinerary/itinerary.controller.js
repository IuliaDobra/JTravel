import BaseInjectable from '../../js/BaseInjectable';

class ItineraryController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, ItineraryController.$inject);
        const userId = this.authService.isAuthenticated();
        const ref = firebase.database().ref('itinerary').child(userId);
        let syncObject = this.$firebaseObject(ref);

        syncObject.$bindTo(this.$scope, "itineraries");
        this.$scope.$watch('itineraries', (r) => {
            this.itineraries = r;
            console.log(this.itineraries);}
        )
    }
}

ItineraryController.$inject = [
    '$cookies',
    '$state',
    '$scope',
    'authService',
    'mapsService',
    '$firebaseObject',

];

export default ItineraryController;
