import itineraryComponent from './itinerary.component';
import './itinerary.scss';
import templatePrint from './print.html';

let itineraryModule = angular.module('jtravel.itinerary', [

    ])
    .config(config)
    .component('itinerary', itineraryComponent);



function config($stateProvider) {
    $stateProvider
        .state('master.itinerary', {
            url: '/itinerary',
            template: '<itinerary></itinerary>',
        })
        .state('master.itinerary.print', {
            url: '/:itineraryId',
            template: templatePrint,
        });
}

config.$inject = [
    '$stateProvider'
];

export default itineraryModule;
