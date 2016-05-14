import templateUrl from './navbar.html';
import controller from './navbar.controller.js';

let NavBarComponent = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
};

export default NavBarComponent;
