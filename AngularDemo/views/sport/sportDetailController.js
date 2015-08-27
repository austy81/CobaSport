angular.module('app').controller('sportDetailController', ['$scope', '$http', '$routeParams', '$modal', 'Sport', 'Meeting', 'Player', 'SportPlayer', '$session', '$alertService', '$filter',
    function ($scope, $http, $routeParams, $modal, Sport, Meeting, Player, SportPlayer, $session, $alertService, $filter) {

        $scope.selectboxPlayers = [];
        $scope.sport = {};
        $scope.sportId = $routeParams.sportId;

        var sportLoaded = function (data) {
            if (data.value) {
                data.value[0].SportPlayers.sort(comparePlayerLastName);
                data.value[0].Meetings.sort(compareMeetingTimestamp);
                AddClassAttribute(data.value[0].Meetings);
                $scope.sport = data.value[0];
            } else {
                alert('Wrong data received from server');
            };
        };

        var AddClassAttribute = function(meetings) {
            var index, closestIndex, currentDiff, closestDiff;
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            closestDiff = -1000000000;
            closestIndex = 0;
            for (index = 0; index < meetings.length; index++) {
                currentDiff = yesterday - new Date(meetings[index].Timestamp);

                if (currentDiff < 0) {
                    meetings[index].Class = 'warning';
                } else {
                    meetings[index].Class = 'active';
                }

                //if (!closestDiff && currentDiff < 0) closestDiff = currentDiff;
                if (currentDiff > closestDiff && currentDiff < 0) {
                    closestIndex = index;
                    closestDiff = currentDiff;
                }
            }
            if (closestDiff > -1000000000)
                meetings[closestIndex].Class = 'success';
        }

        var comparePlayerLastName = function(sportPlayerA, sportPlayerB) {
            if (sportPlayerA.Player.LastName < sportPlayerB.Player.LastName) return -1;
            if (sportPlayerA.Player.LastName > sportPlayerB.Player.LastName) return 1;
            return 0;
        };

        var compareMeetingTimestamp = function (meetingA, meetingB) {
            if (meetingA.Timestamp < meetingB.Timestamp) return 1;
            if (meetingA.Timestamp > meetingB.Timestamp) return -1;
            return 0;
        }

        var getSport = function () {
            var sportId = $scope.sportId;
            Sport.query({
                $select: 'Id,Caption,SportPlayers,Meetings',
                $expand: 'SportPlayers($expand=Player),Meetings',
                $filter: 'Id eq ' + sportId
            }, sportLoaded);
        };

        var playersLoaded = function(data) {
            $scope.selectboxPlayers = data.value;
        };
        var getSelectboxPlayers = function () {
            Player.query({
                $expand: 'SportPlayers',
                $filter: 'SportPlayers/all (s: s/SportId ne ' + $scope.sportId + ')',
                $orderby: 'LastName'
            }, playersLoaded);
        };

        $scope.deleteMeeting = function(id) {
            Meeting.delete({ Id: id }, function () {
                $alertService.add('success', 'Meeting was deleted.');
                getSport();
            });
        };

        $scope.deleteSportPlayer = function (id) {
            SportPlayer.delete({ Id: id }, function () {
                $alertService.add('success', 'Meeting player was unassigned from this sport.');
                getSport();
                getSelectboxPlayers();
            });
        };

        $scope.upsertMeeting = function (entity) {
            if (!entity) {
                var d = new Date();
                d.setHours(0, 0, 0, 0);
                entity = { Timestamp: d, SportId: $scope.sportId };
                $scope.sport.Meetings.push(entity);
            };

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'meetingEdit.html',
                controller: 'entityEditController',
                resolve: {
                    modalObject: function () {
                        return {
                            apiController: Meeting,
                            entity: entity
                        };
                    }
                }
            });

            var success = function (data) {
                $alertService.add('success', 'Meeting ' + $filter('date')(data.Timestamp, 'EEE d. M. yyyy') + ' was added to sport ' + $scope.sport.Caption + '.');
                getSport();
            };

            var error = function () {
                $alertService.add('error', 'There were some error during meeting adding.');
                getSport();
            };

            modalInstance.result.then(success, error);
        };

        $scope.insertSportPlayer = function () {

            if ($scope.selectboxPlayers.length == 0) {
                $alertService.add('warning', 'There are no more players which are not assigned to this sport. You need to create them first.');
                return;
            }

            var entity;
            entity = { SportId: $scope.sportId, PlayerId: null };

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'sportPlayerInsert.html',
                controller: 'entityEditController',
                resolve: {
                    modalObject: function () {
                        return {
                            apiController: SportPlayer,
                            entity: entity,
                            selects: { players: $scope.selectboxPlayers }
                        };
                    }
                }
            });

            var success = function (data) {
                $alertService.add('success', 'Player was assigned to ' + $scope.sport.Caption + '.');
                getSport();
                getSelectboxPlayers();
            };

            var error = function () {
                $alertService.add('error', 'Some error occured during player assigning to sport ' + $scope.sport.Caption + '.');
                getSport();
            };

            modalInstance.result.then(success, error);
        };

        $scope.getMeetingClass = function (playerId) {
            var meetingPlayer = $scope.getMeetingPlayer(playerId);
            if (meetingPlayer) {
                if (meetingPlayer.IsAttending == true) return 'success';
                if (meetingPlayer.IsAttending == false) return 'danger';
                if (meetingPlayer.IsAttending == null) return 'warning';
            }
            return 'active';
        };

        $scope.isLoggedIn = function () {
            if ($session.loggedInPlayer()) {
                return true;
            }
            return false;
        };

        getSport();
        getSelectboxPlayers();

    }
]);