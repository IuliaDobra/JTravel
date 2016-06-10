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
import firebase from '../node_modules/firebase/firebase';

//import autocomplete from './js/lib/autocomplete.min'
import angularCookies from 'angular-cookies';
//import ngMap from './js/lib/ng-map';
//import googleMaps from './js/lib/angular-google-maps';

// CSS entry point
import './styles/index.scss';
//import './styles/lib/autocomplete.min.css';
import '../node_modules/angular-toastr/dist/angular-toastr.min.css';

angular.module('seed', [
    uiRouter,
    ngResource,
    commonModules.name,
    componentsModule.name,
    'toastr',
    'ngCookies',
    'google-maps',
])

    .config(appConfig)
    .run(appRunBlock)
    .service('authService', authService);