import BaseInjectable from '../../js/BaseInjectable';

class NavBarController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, NavBarController.$inject);
    }

    logout() {
        this.authService.logout();
    }
}

NavBarController.$inject = [
    'authService',
    '$state'
];

export default NavBarController;
