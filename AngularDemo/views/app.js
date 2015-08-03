angular.module('app', ['ngRoute', 'ui.bootstrap', 'ngResource', 'app.services', 'ngAnimate', 'angular-loading-bar', 'satellizer', 'ngCookies']);

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
    .config(function($authProvider) {
        //https://github.com/sahat/satellizer
        //$authProvider.facebook({
        //    clientId: '624059410963642'
        //});
        $authProvider.google({
            clientId: '815231347440-p39g1jdncc1fju23o5nm4n4ho94t72g3.apps.googleusercontent.com',
            url: '/auth/login'
        });

        //$authProvider.github({
        //    clientId: '0ba2600b1dbdb756688b'
        //});

        //$authProvider.linkedin({
        //    clientId: '77cw786yignpzj'
        //});

        //$authProvider.yahoo({
        //    clientId: 'dj0yJmk9dkNGM0RTOHpOM0ZsJmQ9WVdrOVlVTm9hVk0wTkRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMA--'
        //});

        //$authProvider.live({
        //    clientId: '000000004C12E68D'
        //});

        //$authProvider.twitter({
        //    url: '/auth/twitter'
        //});

        //$authProvider.oauth2({
        //    name: 'foursquare',
        //    url: '/auth/foursquare',
        //    redirectUri: window.location.origin,
        //    clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
        //    authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
        //});

    });