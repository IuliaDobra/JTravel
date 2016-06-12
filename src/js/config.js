let appConfig = function(toastrConfig, $urlRouterProvider) {
    angular.extend(toastrConfig, {
        positionClass: 'toast-top-center'
    });

    var config = {
        apiKey: "AIzaSyCq2hFoQC5bF5B5-53SOtaJlYZX4Yp5NNI",
        authDomain: "jtravel.firebaseapp.com",
        databaseURL: "https://jtravel.firebaseio.com",
        storageBucket: "project-2250749023745628841.appspot.com"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    $urlRouterProvider.otherwise('/login');
};

appConfig.$inject = [
    'toastrConfig',
    '$urlRouterProvider'
];

export default appConfig;