import templateUrl from './dashboard.html';
import controller from './dashboard.controller.js';

let DashboardComponent = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
};

export default DashboardComponent;
