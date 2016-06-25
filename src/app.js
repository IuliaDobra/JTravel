import $ from 'jquery';
import _ from 'lodash';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngResource from 'angular-resource';
import toastr from 'angular-toastr';
import appConfig from './js/config';
import appRunBlock from './js/run';
import commonModules from './common/common';
import componentsModule from './components/components';
import authService from './js/services/authService';
import mapsService from './js/services/mapsService';
import datepickerService from './js/services/datepickerService';
import material from 'angular-material';
import angularFire from '../node_modules/angularfire/dist/angularfire';
import firebase from '../node_modules/firebase/firebase';
import '../node-modules/angular-ui-bootstrap/dist/ui-bootstrap.js';
import '../node-modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js';
import '../node-modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css';

//import autocomplete from './js/lib/autocomplete.min'
import angularCookies from 'angular-cookies';
//import ngMap from './js/lib/ng-map';
//import googleMaps from './js/lib/angular-google-maps';

// CSS entry point
import './styles/index.scss';
import '../node_modules/angular-toastr/dist/angular-toastr.min.css';
import '../node_modules/angular-material/angular-material.min.css';


angular.module('seed', [
    uiRouter,
    material,
    ngResource,
    commonModules.name,
    componentsModule.name,
    'firebase',
    'toastr',
    'ngCookies',
    'google-maps',
    'ui.bootstrap'
])

    .config(appConfig)
    .run(appRunBlock)
    .service('authService', authService)
    .service('mapsService', mapsService)
    .service('datepickerService', datepickerService);