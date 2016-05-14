import templateUrl from './master.html';
import controller from './master.controller';

let masterComponent = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
};

export default masterComponent;
