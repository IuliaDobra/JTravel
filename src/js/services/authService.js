import BaseInjectable from '../BaseInjectable';

class AuthenticationService extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, AuthenticationService.$inject);
        this.ref = new Firebase("https://jtravel.firebaseio.com");
    }

    createUser(createEmail, createPassword) {
        this.ref.createUser({
            email    : createEmail,
            password : createPassword
        }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });
    }

    authUser(authEmail, authPassword) {
        this.ref.authWithPassword({
            email    : authEmail,
            password : authPassword
        }, (error, authData) => {
            if (error) {
                console.log("Login Failed!", error);
                return false;
            } else {
                console.log("Authenticated successfully with payload:", authData);
                this.$cookies.put('uid', authData.uid);
                this.$state.go('master.dashboard');
                return true;
            }
        });
    }

    logout() {
        this.$cookies.remove('uid');
        this.$state.go('login');
    }

    isAuthenticated() {
        return this.$cookies.get('uid');
    }
}

AuthenticationService.$inject = [
    '$rootScope',
    '$cookies',
    '$state'
];

export default AuthenticationService;
