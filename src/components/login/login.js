import loginComponent from './login.component';
import './login.scss';

let loginModule = angular.module('jtravel.login', [

    ])
    .config(config)
    .component('login', loginComponent);



function config($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            template: '<login></login>'
        });
}

config.$inject = [
    '$stateProvider'
];

export default loginModule;
