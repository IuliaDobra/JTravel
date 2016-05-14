import BaseInjectable from '../../js/BaseInjectable';

class MasterController extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, MasterController.$inject);
    }

}

MasterController.$inject = [
];

export default MasterController;
