app.controller('meetingDetailController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        var apiUrl = 'http://localhost:56513/api';
        var apiMeeting = '/meeting/';
        var apiSport = '/sport/';
        var apiSportsPlayers = '/sportplayer/sport/{sportId}/players';
        var apiMeetingPlayers = '/meeting/{meetingId}/players';

        $scope.meetingId = $routeParams.meetingId;
        $scope.sport = {};
        $scope.meeting = {};
        $scope.sportPlayers = [];
        $scope.meetingPlayers = [];


        var getSportPlayers = function(sportId) {
            var requestUrl = apiUrl + apiSportsPlayers.replace('{sportId}', sportId);
            $http.get(requestUrl)
                .success(function(data) {
                    $scope.sportPlayers = data;
                });
        };

        var getMeetingPlayers = function (meetingId) {
            var requestUrl = apiUrl + apiMeetingPlayers.replace('{meetingId}', meetingId);
            $http.get(requestUrl)
                .success(function(data) {
                    $scope.meetingPlayers = data;
                });
        };

        var getMeeting = function(meetingId) {
            $http.get(apiUrl + apiMeeting + meetingId)
                .success(function(data) {
                    $scope.meeting = data;
                    getSport(data.SportId);
                    getSportPlayers(data.SportId);
                });
        };

        var getSport = function (sportId) {
            $http.get(apiUrl + apiSport + sportId)
                .success(function (data) {
                    $scope.sport = data;
                });
        };

        $scope.answerYES = function(playerId) {
            
        }
        $scope.answerNO = function (playerId) {

        }
        $scope.answerDONTKNOW = function (playerId) {

        }

        getMeeting($scope.meetingId);
        getMeetingPlayers($scope.meetingId);

    }
]);