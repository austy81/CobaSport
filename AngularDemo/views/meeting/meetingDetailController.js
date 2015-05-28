app.controller('meetingDetailController', ['$scope', '$http', '$routeParams', 'SportPlayer', 'MeetingPlayer', 'Meeting' ,'Sport',
    function ($scope, $http, $routeParams, SportPlayer, MeetingPlayer, Meeting, Sport) {


        $scope.meetingId = $routeParams.meetingId;
        $scope.sportId = null;
        $scope.sport = {};
        $scope.meeting = {};
        $scope.sportPlayers = [];
        $scope.meetingPlayers = [];
        $scope.totalAttenders = 0;


        var getSportPlayers = function(sportId) {
            SportPlayer.query({ $expand: 'Player,Player/MeetingPlayer', $filter: 'SportId eq ' + sportId }, sportPlayersLoaded);
        };
        var sportPlayersLoaded = function (data) {
            $scope.sportPlayers = data.value;
            //getMeetingPlayers($scope.meetingId);
        };

        //var getMeetingPlayers = function (meetingId) {
        //    MeetingPlayer.query({ $filter: 'MeetingId eq ' + meetingId }, meetingPlayersLoaded);
        //};
        //var meetingPlayersLoaded = function (data) {
        //    $scope.meetingPlayers = data.value;
        //    mergeSportsPlayersWithMeetingPlayers(data.value);
        //};

        var getMeeting = function(meetingId) {
            Meeting.query({Id:meetingId},meetingLoaded);
        };
        var meetingLoaded = function(data) {
            $scope.meeting = data;
            $scope.sportId = data.SportId;
            getSport($scope.sportId);
            getSportPlayers($scope.sportId);
        };

        var getSport = function (sportId) {
            Sport.query({Id: sportId}, sportLoaded);
        };
        var sportLoaded = function(data) {
            $scope.sport = data;
        };

        $scope.answer = function (player, isAttending) {
            var MeetingPlayerId = null;
            if (player.MeetingPlayer)
                if (player.MeetingPlayer.length > 0)
                    MeetingPlayerId = player.MeetingPlayer[0].Id;

            var data = {
                Id: MeetingPlayerId,
                PlayerId: player.Player.Id,
                MeetingId: $scope.sportId,
                IsAttending: isAttending
            };
            var success = function() {
                getSportPlayers($scope.sportId);
            };
            var error = function() {
                alert(data.Message);
            };

            if (data.Id) {
                MeetingPlayer.update({ Id: data.Id }, data, success, error);
            } else {
                MeetingPlayer.save(data, success, error);
            }
        };

        getMeeting($scope.meetingId);
        
        //var mergeSportsPlayersWithMeetingPlayers = function (meetingPlayers) {
        //    $scope.totalAttenders = 0;
        //    for (var meetingIndex = 0; meetingIndex < meetingPlayers.length; meetingIndex++) {
        //        var meetingPlayer = meetingPlayers[meetingIndex];
        //        for (var sportIndex = 0; sportIndex < $scope.sportPlayers.length; sportIndex++)
        //        {
        //            var sportPlayer = $scope.sportPlayers[sportIndex];
        //            if (sportPlayer.Id == meetingPlayer.PlayerId) {
        //                sportPlayer.meetingPlayer = meetingPlayer;
        //                if (meetingPlayer.IsAttending) $scope.totalAttenders++;
        //            }
        //        }
        //    }
        //};

    }
]);