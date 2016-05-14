import angular from 'angular';
import uiRouter from 'angular-ui-router';
import masterComponent from './master.component';


let masterModule = angular.module('master', [
        uiRouter
    ])

    .config(masterConfig)
    .component('master', masterComponent);



function masterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('master', {
            abstract: true,
            url: '/jtravel',
            template: '<master></master>'
        });
}

masterConfig.$inject = [
    '$stateProvider'
];


export default masterModule;
