app.controller('sportDetailController', ['$scope', '$http', '$routeParams', '$modal', 'Sport', 'Meeting', 'Player', 'SportPlayer', function($scope, $http, $routeParams, $modal, Sport, Meeting, Player, SportPlayer) {

        $scope.meetings = [];
        $scope.players = [];
        $scope.sportPlayers = [];
        $scope.sport = {};
        $scope.sportId = $routeParams.sportId;

        var sportLoaded = function(data) {
            $scope.sport = data;
        };

        var playersLoaded = function(data) {
            $scope.players = data.value;
        };

        var meetingsLoaded = function(data) {
            $scope.meetings = [];
            var index;
            for (index = 0; index < data.length; ++index) {
                if (data[index].SportId == sportId)
                    $scope.meetings.push(data[index]);
            }
        };

        var sportPlayersLoaded = function(data) {
            $scope.sportPlayers = data.value;
        };

        var getSport = function(sportId) {
            Sport.query({ Id: sportId }, sportLoaded);
        };

        var getPlayers = function () {
            Player.query(playersLoaded);
        };

        var getMeetings = function(sportId) {
            Meeting.query(meetingsLoaded);
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
            SportPlayer.delete({ Id: id }, function () { getSportPlayers($scope.sportId); });
        };

        $scope.upsertMeeting = function (entity) {
            if (!entity) {
                entity = { Timestamp: new Date() };
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
            var entity;
            entity = { SportId: $scope.sportId, PlayerId: 0 };
            $scope.sportPlayers.push(entity);

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'sportPlayerInsert.html',
                controller: 'entityEditController',
                resolve: {
                    modalObject: function () {
                        return {
                            apiController: SportPlayer,
                            entity: entity,
                            selects: { players: $scope.players }
                        };
                    }
                }
            });

            var success = function (data) {
                entity.Id = data.Id;
            };

            var error = function () {
                getSportPlayers($scope.sportId);
            };

            modalInstance.result.then(success, error);
        };

        getMeetings($scope.sportId);
        getSportPlayers($scope.sportId);
        getSport($scope.sportId);
        getPlayers();

    }
]);