import itineraryComponent from './itinerary.component';
import './itinerary.scss';

let itineraryModule = angular.module('jtravel.itinerary', [

    ])
    .config(config)
    .component('itinerary', itineraryComponent);



function config($stateProvider) {
    $stateProvider
        .state('master.itinerary', {
            url: '/itinerary',
            template: '<itinerary></itinerary>'
        });
}

config.$inject = [
    '$stateProvider'
];

export default itineraryModule;
