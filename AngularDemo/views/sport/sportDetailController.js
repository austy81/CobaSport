﻿app.controller('sportDetailController', ['$scope', '$http', '$routeParams', '$modal', 'Sport', 'Meeting', 'Player', 'SportPlayer', function($scope, $http, $routeParams, $modal, Sport, Meeting, Player, SportPlayer) {

        $scope.selectboxPlayers = [];
        $scope.sport = {};
        $scope.sportId = $routeParams.sportId;

        var sportLoaded = function (data) {
            if (data.value) {
                $scope.sport = data.value[0];
            } else {
                alert('Wrong data received from server');
            };
        };
        var getSport = function () {
            var sportId = $scope.sportId;
            Sport.query({ $select: 'Id,Caption,SportPlayers,Meetings', $expand: 'SportPlayers/Player,Meetings', $filter: 'Id eq ' + sportId }, sportLoaded);
        };

        var playersLoaded = function(data) {
            $scope.selectboxPlayers = data.value;
        };
        var getSelectboxPlayers = function () {
            Player.query({ $expand: 'SportPlayers', $filter: 'SportPlayers/all (s: s/SportId ne ' + $scope.sportId + ')' }, playersLoaded);
        };

        $scope.deleteMeeting = function(id) {
            Meeting.delete({ Id: id },function () {
                getSport();
            });
        };

        $scope.deleteSportPlayer = function (id) {
            SportPlayer.delete({ Id: id }, function() {
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
                entity.Id = data.Id;
            };

            var error = function () {
                getSport();
            };

            modalInstance.result.then(success, error);
        };

        $scope.insertSportPlayer = function () {

            if ($scope.selectboxPlayers.length == 0) {
                alert('There are no more players which are not assigned to this sport. You need to create them first.');
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
                getSport();
                getSelectboxPlayers();
            };

            var error = function () {
                getSport();
            };

            modalInstance.result.then(success, error);
        };

        getSport();
        getSelectboxPlayers();

    }
]);