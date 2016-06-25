import BaseInjectable from '../../js/BaseInjectable';

class LoginController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, LoginController.$inject);
        this.authEmail = 'test@test.com';
        this.authPassword = 'test';

        this.provider = new firebase.auth.GoogleAuthProvider();

    }

    createUser() {
        this.authService.createUser(this.createEmail,this.createPassword);
        window.alert("Your account has been created!");
    }

    authUser() {
        if (this.authService.authUser(this.authEmail, this.authPassword)) {
            this.$state.go('master.dashboard');
        }
    }

    googleAuth() {
        firebase.auth().signInWithPopup(this.provider).then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            this.$cookies.put('uid', user.uid);
            this.$state.go('master.dashboard');
            // ...
        }).catch(function(error) {
            console.log(error.message);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
}

LoginController.$inject = [
    '$cookies',
    '$state',
    'authService'
];

export default LoginController;
