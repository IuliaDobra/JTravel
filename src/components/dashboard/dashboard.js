import DashboardComponent from './dashboard.component.js';
import './dashboard.scss';

let DashboardModule = angular.module('jtravel.dashboard', [

    ])
    .config(config)
    .component('dashboard', DashboardComponent);



function config($stateProvider) {
    $stateProvider
        .state('master.dashboard', {
            url: '/dashboard',
            template: '<dashboard></dashboard>'
        });
}

config.$inject = [
    '$stateProvider'
];

export default DashboardModule;
