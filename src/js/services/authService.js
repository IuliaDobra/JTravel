import BaseInjectable from '../BaseInjectable';

class AuthenticationService extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, AuthenticationService.$inject);
    }

    createUser(createEmail, createPassword) {
        var userData = firebase.auth().createUserWithEmailAndPassword(createEmail, createPassword).catch(function(error) {
            console.log("Error creating user:", error.message);
        });

        if(userData) {
            console.log("Successfully created user account with uid:", userData.uid);
        }
    }

    authUser(authEmail, authPassword) {
        firebase.auth().signInWithEmailAndPassword(authEmail, authPassword).catch(function(error) {
            if (error) {
                console.log("Login Failed!", error.message);
                return false;
            }
        });

        var userData = firebase.auth().currentUser;

        if(userData) {
            console.log("Authenticated successfully with payload:", userData);
            this.$cookies.put('uid', userData.uid);
            this.$state.go('master.dashboard');
            return true;
        }
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
