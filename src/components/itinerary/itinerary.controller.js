import BaseInjectable from '../../js/BaseInjectable';

class ItineraryController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, ItineraryController.$inject);
        this.isAuth();
        const userId = this.authService.isAuthenticated();
        const ref = firebase.database().ref('itinerary').child(userId);
        let syncObject = this.$firebaseObject(ref);

        syncObject.$bindTo(this.$scope, "itineraries");
        this.$scope.$watch('itineraries', (r) => {
            this.itineraries = r;
            console.log(this.itineraries);}
        );
    }


    isAuth() {
        var userId = this.authService.isAuthenticated();
        if(!userId) {
            this.$state.go('login');
        }
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
