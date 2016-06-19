import BaseInjectable from '../BaseInjectable';

class DatepickerService extends BaseInjectable {
    constructor(...injectables) {
        super(injectables, DatepickerService.$inject);

        $('.has-datepicker').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
    }
}

DatepickerService.$inject = [
    '$rootScope',
    '$cookies',
    '$state',
];

export default DatepickerService;