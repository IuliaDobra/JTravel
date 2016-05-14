import templateUrl from './login.html';
import controller from './login.controller';

let loginComponent = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
};

export default loginComponent;
