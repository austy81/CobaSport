﻿angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'ngResource',
    'app.config',
    'app.dataServices',
    'ngAnimate',
    'angular-loading-bar',
    'satellizer',
    'ngCookies',
    'app.alertServices',
    'app.sessionServices',
    'angular-confirm']);

angular.module('app')
    .config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/sports', {
                    templateUrl: 'views/sport/sportList.html',
                    controller: 'sportListController'
                }).
                when('/sports/:sportId', {
                    templateUrl: 'views/sport/sportDetail.html',
                    controller: 'sportDetailController'
                }).
                when('/meetings/:meetingId', {
                    templateUrl: 'views/meeting/meetingDetail.html',
                    controller: 'meetingDetailController'
                }).
                when('/players', {
                    templateUrl: 'views/player/playerList.html',
                    controller: 'playerListController'
                })
                .when('/players/:playerId', {
                    templateUrl: 'views/player/playerDetail.html',
                    controller: 'playerDetailController'
                })
                .otherwise({
                    redirectTo: '/sports'
                });
        }
    ])
    .config(function ($authProvider, appConfig) {
        //https://github.com/sahat/satellizer
        $authProvider.google(appConfig.authProvider.google);
    });