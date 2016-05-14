import BaseInjectable from '../../js/BaseInjectable';

class LoginController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, LoginController.$inject);
        this.authEmail = 'test@test.com';
        this.authPassword = 'test';

    }

    createUser() {
        this.authService.createUser(this.createEmail,this.createPassword);
    }

    authUser() {
        if (this.authService.authUser(this.authEmail, this.authPassword)) {
            $state.go('master.dashboard');
        }
    }
}

LoginController.$inject = [
    '$cookies',
    '$state',
    'authService'
];

export default LoginController;
