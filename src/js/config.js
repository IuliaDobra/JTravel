let appConfig = function(toastrConfig, $urlRouterProvider) {
    angular.extend(toastrConfig, {
        positionClass: 'toast-top-center'
    });

    $urlRouterProvider.otherwise('/login');
};

appConfig.$inject = [
    'toastrConfig',
    '$urlRouterProvider'
];

export default appConfig;