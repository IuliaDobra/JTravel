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

        this.isVisible = false;
    }


    isAuth() {
        var userId = this.authService.isAuthenticated();
        if(!userId) {
            this.$state.go('login');
        }
    }

    delete(itineraryId, placeId) {
        var userId = this.authService.isAuthenticated();
        firebase.database().ref('itinerary').child(userId).child(itineraryId).child('places').child(placeId).remove();
    }

    update(itineraryId) {
        var userId = this.authService.isAuthenticated();
        firebase.database().ref('itinerary').child(userId).orderByKey().equalTo(itineraryId).once('value', (r) => {
            if(r.val()) {
                firebase.database().ref('itinerary/' + userId + '/' + itineraryId).update({
                    enabled: 1,
                });

                var itinerary = r.val()[Object.keys(r.val())[0]];
                this.$cookies.put('isEdit', true);
                this.$cookies.put('itinerary_key', itineraryId);
                this.$cookies.put('startDate', itinerary.startDate);
                this.$cookies.put('endDate', itinerary.endDate);
                this.$cookies.put('destinationPlaceId', itinerary.destinationPlaceId);
                this.$cookies.put('originPlaceId', itinerary.originPlaceId);
                this.$state.go('master.dashboard');
            }
        });
    }

    toggleView() {
        this.isVisible = !this.isVisible;
        return this.isVisible;
    }

    printItinerary(id) {
        this.$state.go('master.itinerary.print', {itineraryId: id});
    }
}

ItineraryController.$inject = [
    '$cookies',
    '$state',
    '$scope',
    '$rootScope',
    'authService',
    'mapsService',
    '$firebaseObject',

];

export default ItineraryController;
