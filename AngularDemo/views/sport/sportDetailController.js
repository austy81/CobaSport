app.controller('sportDetailController', ['$scope', '$http', '$routeParams', '$modal', 'Sport', 'Meeting', 'Player', 'SportPlayer', function($scope, $http, $routeParams, $modal, Sport, Meeting, Player, SportPlayer) {

        $scope.meetings = [];
        $scope.selectboxPlayers = [];
        $scope.sportPlayers = [];
        $scope.sport = {};
        $scope.sportId = $routeParams.sportId;

        var sportLoaded = function(data) {
            $scope.sport = data;
        };

        var playersLoaded = function(data) {
            $scope.selectboxPlayers = data.value;
        };

        var meetingsLoaded = function(data) {
            $scope.meetings = data.value;
        };

        var sportPlayersLoaded = function(data) {
            $scope.sportPlayers = data.value;
        };

        var getSport = function(sportId) {
            Sport.query({ Id: sportId }, sportLoaded);
        };

        var getSelectboxPlayers = function () {
            Player.query({ $expand: 'SportPlayer', $filter: 'SportPlayer/all (s: s/SportId ne ' + $scope.sportId + ')' }, playersLoaded);
        };

        var getMeetings = function(sportId) {
            Meeting.query({ $select: 'Id,Timestamp,SportId', $filter: 'SportId eq ' + $scope.sportId }, meetingsLoaded);
        };

        var getSportPlayers = function(sportId) {
            SportPlayer.query({ $select : 'Id,Player,SportId,PlayerId', $expand: 'Player' }, sportPlayersLoaded);
        };

        $scope.deleteMeeting = function(id) {
            Meeting.delete({ Id: id },function () {
                getMeetings($scope.sportId);
            });
        };

        $scope.deleteSportPlayer = function (id) {
            SportPlayer.delete({ Id: id }, function() {
                getSportPlayers($scope.sportId);
                getSelectboxPlayers();
            });
        };

        $scope.upsertMeeting = function (entity) {
            if (!entity) {
                var d = new Date();
                d.setHours(0, 0, 0, 0);
                entity = { Timestamp: d, SportId: $scope.sportId };
                $scope.meetings.push(entity);
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
                getMeetings();
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
                getSportPlayers($scope.sportId);
                getSelectboxPlayers();
            };

            var error = function () {
                getSportPlayers($scope.sportId);
            };

            modalInstance.result.then(success, error);
        };

        getMeetings($scope.sportId);
        getSportPlayers($scope.sportId);
        getSport($scope.sportId);
        getSelectboxPlayers();

    }
]);