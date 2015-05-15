var app = angular.module('app', ['ngRoute']);

app.config([
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
            when('/players/:playerId', {
                templateUrl: 'views/player/playerDetail.html',
                controller: 'playerDetailController'
            })
            .otherwise({
                redirectTo: '/sports'
            });
    }
]);