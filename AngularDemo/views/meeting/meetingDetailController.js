angular.module('app').controller('meetingDetailController', ['$scope', '$http', '$routeParams', '$location', 'SportPlayer', 'MeetingPlayer', 'Meeting', '$alertService',
    function ($scope, $http, $routeParams, $location, SportPlayer, MeetingPlayer, Meeting, $alertService) {

        $scope.meetingId = $routeParams.meetingId;
        $scope.selectedMeeting = {};
        $scope.meeting = {};
        $scope.meetingsSelect = [];
        $scope.totalAttenders = 0;
        $scope.totalDontKnowers = 0;
        $scope.totalNoers = 0;
        $scope.playersEmails = '';

        $scope.$watch('selectedMeeting', function (newValue, oldValue) {
            if (newValue.Id) {
                $location.path("/meetings/" + newValue.Id);
            };
        });

        var getMeeting = function(meetingId) {
            Meeting.query(
                {
                    $select: 'Id,Timestamp',
                    $expand: '' +
                        'Sport ($expand=' +
                            'SportPlayers(' +
                                '$expand=Player)' +
                            ',Meetings)' +
                        ',MeetingPlayers (' +
                            '$expand=Player)',
                    $filter: 'Id eq ' + meetingId
                }, meetingLoaded);
        };
        var meetingLoaded = function(data) {
            $scope.meeting = data.value[0];
            $scope.meeting.Sport.Meetings.sort(compareMeetingTimestamp);
            $scope.meetingsSelect = jQuery.extend(true, [], $scope.meeting.Sport.Meetings);
            $scope.sportAndMeetingPlayers = mergeSportAndMeetingPlayers($scope.meeting.Sport.SportPlayers, $scope.meeting.MeetingPlayers);
            $scope.selectedMeeting = $scope.meeting;
            setMeetingPlayersCounts($scope.meeting.MeetingPlayers);
            $scope.totalNotAnswered = $scope.sportAndMeetingPlayers.length - $scope.totalAttenders - $scope.totalDontKnowers - $scope.totalNoers;
        };

        var compareMeetingTimestamp = function (meetingA, meetingB) {
            if (meetingA.Timestamp < meetingB.Timestamp) return 1;
            if (meetingA.Timestamp > meetingB.Timestamp) return -1;
            return 0;
        }

        var mergeSportAndMeetingPlayers = function(sportPlayers, meetingPlayers) {
            var result = [];
            var index;
            for (index = 0; index < sportPlayers.length; index++) {
                result.push(sportPlayers[index].Player);
            };

            for (index = 0; index < meetingPlayers.length; index++) {
                if (indexOfByObjectId(result, meetingPlayers[index].Player.Id) < 0)
                    result.push(meetingPlayers[index].Player);
            };

            result.sort(function (playerA, playerB) {
                if (playerA.LastName < playerB.LastName) return -1;
                if (playerA.LastName > playerB.LastName) return 1;
                return 0;
            });

            $scope.playersEmails = playersEmails(result);

            return result;
        };

        var indexOfByObjectId = function(arr, Id) {
            var index;
            for (index = 0; index < arr.length; index++) {
                if (arr[index].Id == Id) return index;
            };
            return -1;
        };

        var setMeetingPlayersCounts = function (meetingPlayers) {
            var index;

            $scope.totalAttenders = 0;
            $scope.totalDontKnowers = 0;
            $scope.totalNoers = 0;

            for (index = 0; index < meetingPlayers.length; index++) {
                if (meetingPlayers[index].IsAttending) $scope.totalAttenders++;
                if (meetingPlayers[index].IsAttending === null) $scope.totalDontKnowers++;
                if (meetingPlayers[index].IsAttending === false) $scope.totalNoers++;
            };
        };

        $scope.getAttendanceClass = function(playerId) {
            var meetingPlayer = $scope.getMeetingPlayer(playerId);
            if (meetingPlayer) {
                if (meetingPlayer.IsAttending == true) return 'success';
                if (meetingPlayer.IsAttending == false) return 'danger';
                if (meetingPlayer.IsAttending == null) return 'warning';
            }
            return 'active';
        };

        $scope.getAttendanceLabel = function (playerId) {
            var attendanceClass = $scope.getAttendanceClass(playerId);
            if (attendanceClass == 'success') return 'Yes';
            if (attendanceClass == 'danger') return 'No';
            if (attendanceClass == 'warning') return 'Dont know';
            if (attendanceClass == 'active') return 'Not answered';
            return '';
        };

        $scope.answer = function(player, isAttending) {

            var entity = {};
            var meetingPlayer = $scope.getMeetingPlayer(player.Id);
            if (meetingPlayer) {
                entity = meetingPlayer;
                entity.Player = undefined;
            } else {
                entity =  {
                    PlayerId: player.Id,
                    MeetingId: $scope.meeting.Id
                };

            }
            entity.IsAttending = isAttending;

            var success = function(entity) {
                getMeeting($scope.meeting.Id);
                if (entity.IsAttending === true) $alertService.add('success', "Looking forward to se you there!");
                if (entity.IsAttending === false) $alertService.add('danger', "It's a pity :-(. Hopefully, you will make it next time!");
                if (entity.IsAttending === null) $alertService.add('warning', "Let's see later... Please let us know whne you will be sure.");
            };
            var error = function (data) {
                $alertService.add('danger', 'Oups, some error with saving your answer.');
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

        var playersEmails = function (sportAndMeetingPlayers) {

            var index;
            var emails = '';
            if (sportAndMeetingPlayers) {
                for (index = 0; index < sportAndMeetingPlayers.length; index++) {
                    var email = sportAndMeetingPlayers[index].Email;
                    if (email) emails = emails + ';' + email;
                };
            };
            return emails;

        }
        

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

        $scope.absUrl = function() {
            return $location.absUrl();
        };

        getMeeting($scope.meetingId);

    }
]);