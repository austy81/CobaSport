app.controller('meetingDetailController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        var apiUrl = 'http://localhost:56513/api';
        var apiMeeting = '/meeting/';
        var apiSport = '/sport/';
        var apiMeetingPlayer = '/meetingplayer';
        var apiSportsPlayers = '/sportplayer/sport/{sportId}/players';
        var apiMeetingPlayers = '/meetingplayer/meeting/{meetingId}';

        $scope.meetingId = $routeParams.meetingId;
        $scope.sportId = null;
        $scope.sport = {};
        $scope.meeting = {};
        $scope.sportPlayers = [];
        $scope.meetingPlayers = [];
        $scope.totalAttenders = 0;


        var getSportPlayers = function(sportId) {
            var requestUrl = apiUrl + apiSportsPlayers.replace('{sportId}', sportId);
            $http.get(requestUrl)
                .success(function(data) {
                    $scope.sportPlayers = data;
                    getMeetingPlayers($scope.meetingId);
                });
        };

        var getMeetingPlayers = function (meetingId) {
            var requestUrl = apiUrl + apiMeetingPlayers.replace('{meetingId}', meetingId);
            $http.get(requestUrl)
                .success(function(data) {
                    $scope.meetingPlayers = data;
                    mergeSportsPlayersWithMeetingPlayers(data);
                });
        };

        var getMeeting = function(meetingId) {
            $http.get(apiUrl + apiMeeting + meetingId)
                .success(function(data) {
                    $scope.meeting = data;
                    $scope.sportId = data.SportId;
                    getSport($scope.sportId);
                    getSportPlayers($scope.sportId);
                });
        };

        var getSport = function (sportId) {
            $http.get(apiUrl + apiSport + sportId)
                .success(function (data) {
                    $scope.sport = data;
                });
        };

        $scope.answer = function (playerId, isAttending) {
            var data = {
                PlayerId: playerId,
                MeetingId: $scope.sportId,
                IsAttending: isAttending
            };
            
            $http.post(apiUrl + apiMeetingPlayer, data)
                .success(function (data, status, headers, config) {
                    getSportPlayers($scope.sportId);
                })
                .error(function (data, status, headers, config) {
                    alert(data.Message);
                });
        };

        getMeeting($scope.meetingId);
        
        var mergeSportsPlayersWithMeetingPlayers = function (meetingPlayers) {
            $scope.totalAttenders = 0;
            for (var meetingIndex = 0; meetingIndex < meetingPlayers.length; meetingIndex++) {
                var meetingPlayer = meetingPlayers[meetingIndex];
                for (var sportIndex = 0; sportIndex < $scope.sportPlayers.length; sportIndex++)
                {
                    var sportPlayer = $scope.sportPlayers[sportIndex];
                    if (sportPlayer.Id == meetingPlayer.PlayerId) {
                        sportPlayer.meetingPlayer = meetingPlayer;
                        if (meetingPlayer.IsAttending) $scope.totalAttenders++;
                    }
                }
            }
        };

    }
]);