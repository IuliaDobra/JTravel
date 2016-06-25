import BaseInjectable from '../../js/BaseInjectable';

class NavBarController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, NavBarController.$inject);

        this.dashboard = true;
        this.itinerary = false;
    }

    logout() {
        this.authService.logout();
    }

    checkItinerary() {
        this.dashboard = false;
        this.itinerary = true;
    }

    checkDashboard() {
        this.dashboard = true;
        this.itinerary = false;
    }
}

NavBarController.$inject = [
    'authService',
    '$state'
];

export default NavBarController;
