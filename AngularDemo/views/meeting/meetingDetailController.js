app.controller('meetingDetailController', ['$scope', '$http', '$routeParams', '$location', 'SportPlayer', 'MeetingPlayer', 'Meeting', 'Sport',
    function ($scope, $http, $routeParams, $location, SportPlayer, MeetingPlayer, Meeting, Sport) {

        $scope.meetingId = $routeParams.meetingId;
        $scope.selectedMeeting = {};
        $scope.meeting = {};
        $scope.meetingsSelect = [];
        $scope.totalAttenders = 0;
        $scope.totalDontKnowers = 0;
        $scope.totalNoers = 0;
        

        $scope.$watch('selectedMeeting', function (newValue, oldValue) {
            if (newValue.Id) {
                $location.path("/meetings/" + newValue.Id);
            };
        });

        var getMeeting = function(meetingId) {
            Meeting.query({ $select: 'Id,Timestamp,Sport,Sport/SportPlayers/Player,Sport/Meetings,MeetingPlayers,MeetingPlayers/Id,MeetingPlayers/Player', $expand: 'Sport,Sport/SportPlayers/Player,Sport/Meetings,MeetingPlayers,MeetingPlayers/Player', $filter: 'Id eq ' + meetingId }, meetingLoaded);
        };
        var meetingLoaded = function(data) {
            $scope.meeting = data.value[0];
            $scope.meetingsSelect = jQuery.extend(true, [], $scope.meeting.Sport.Meetings);
            $scope.selectedMeeting = $scope.meeting;
            $scope.totalAttenders = getTotalAttenders($scope.meeting.MeetingPlayers);
            $scope.totalDontKnowers = getDontKnowers($scope.meeting.MeetingPlayers);
            $scope.totalNoers = getNoers($scope.meeting.MeetingPlayers);
            $scope.totalNotAnswered = $scope.meeting.Sport.SportPlayers.length - $scope.totalAttenders - $scope.totalDontKnowers - $scope.totalNoers;
        };

        var getTotalAttenders = function (meetingPlayers) {
            var result = 0;
            for (index = 0; index < meetingPlayers.length; index++) {
                if (meetingPlayers[index].IsAttending) result++;
            };
            return result;
        };

        var getDontKnowers = function (meetingPlayers) {
            var result = 0;
            for (index = 0; index < meetingPlayers.length; index++) {
                if (meetingPlayers[index].IsAttending == null) result++;
            };
            return result;
        };

        var getNoers = function (meetingPlayers) {
            var result = 0;
            for (index = 0; index < meetingPlayers.length; index++) {
                if (meetingPlayers[index].IsAttending == false) result++;
            };
            return result;
        };

        $scope.getAttendance = function(playerId) {
            var meetingPlayer = $scope.getMeetingPlayer(playerId);
            if (meetingPlayer) {
                if (meetingPlayer.IsAttending == true) return 'Yes';
                if (meetingPlayer.IsAttending == false) return 'No';
                if (meetingPlayer.IsAttending == null) return 'Dont know';
            }
            return 'Not answered';

        };

        $scope.answer = function(player, isAttending) {

            var entity = {};
            var meetingPlayer = $scope.getMeetingPlayer(player.Player.Id);
            if (meetingPlayer) {
                entity = meetingPlayer;
                entity.Player = undefined;
            } else {
                entity =  {
                    PlayerId: player.PlayerId,
                    MeetingId: $scope.meeting.Id,
                };

            }
            entity.IsAttending = isAttending;

            //entity = {
            //    Id: player.Id,
            //    PlayerId: player.PlayerId,
            //    MeetingId: player.MeetingId,
            //};

            var success = function(entity) {
                getMeeting($scope.meeting.Id);
            };
            var error = function (data) {
                alert(data.statusText);
            };

            if (entity.Id) {
                MeetingPlayer.update({ Id: entity.Id }, entity, success, error);
            } else {
                MeetingPlayer.save(entity, success, error);
            }
        };

        $scope.getMeetingPlayer = function (playerId) {
            
            var index;
            if ($scope.meeting.MeetingPlayers) {
                for (index = 0; index < $scope.meeting.MeetingPlayers.length; index++) {
                    if ($scope.meeting.MeetingPlayers[index].PlayerId == playerId) return $scope.meeting.MeetingPlayers[index];
                };
            };
            return false;
        };

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

        getMeeting($scope.meetingId);

    }
]);