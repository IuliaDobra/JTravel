import LoginModule from './login/login';
import MasterModule from './master/master';
import DashboardModule from './dashboard/dashboard';
import ItineraryModule from './itinerary/itinerary';

export default angular.module('jtravel.components', [
    MasterModule.name,
    LoginModule.name,
    DashboardModule.name,
    ItineraryModule.name
]);
