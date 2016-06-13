import templateUrl from './itinerary.html';
import controller from './itinerary.controller';

let itineraryComponent = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
};

export default itineraryComponent;
