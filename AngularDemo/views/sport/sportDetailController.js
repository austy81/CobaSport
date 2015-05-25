app.controller('sportDetailController', ['$scope', '$http', '$routeParams', 'Sport', 'Meeting', 'Player', 'SportPlayer', function($scope, $http, $routeParams, Sport, Meeting, Player, SportPlayer) {

        var apiSportPlayerDelete = '/SportPlayers/sport/{sportId}/player/{playerId}';
        var apiSportPlayer = '/SportPlayers/sport/{sportId}/players';

        $scope.meetings = [];
        $scope.players = [];
        $scope.sportPlayers = [];
        $scope.sport = {};
        $scope.sportId = $routeParams.sportId;

        var getSport = function(sportId) {
            Sport.query({ Id: sportId }, function (data) {
                $scope.sport = data;
            });
        };

        var getPlayers = function () {
            Player.query(function (data) {
                $scope.players = data.value;
            });
        };

        var getMeetings = function(sportId) {
            Meeting.query(function (data) {
                $scope.meetings = [];
                var index;
                for (index = 0; index < data.length; ++index) {
                    if (data[index].SportId == sportId)
                        $scope.meetings.push(data[index]);
                }
            });
        };

        var getSportPlayers = function(sportId) {
            SportPlayer.query(function (data) {
                    $scope.sportPlayers = data;
                });
        };

        $scope.deleteMeeting = function(id) {
            Meeting.delete({ Id: id },function () {
                getMeetings($scope.sportId);
            });
        };

        $scope.deletePlayer = function (playerId) {
            var url = apiUrl + apiSportPlayerDelete.replace('{playerId}', playerId).replace('{sportId}',$scope.sportId);
            $http.delete(url).success(function () {
                getSportPlayers($scope.sportId);
            });
        };

        $scope.upsertMeeting = function (entity) {
            if (!entity) {
                entity = { Timestamp: '' };
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

        $scope.createNewPlayer = function () {
            var data = {
                PlayerId: $scope.selectedPlayerId,
                SportId: $scope.sportId
            };
            $scope.selectedPlayerId = '';
            $http.post(apiUrl + apiSportPlayerCreate, data)
                .success(function (data, status, headers, config) {
                    getSportPlayers($scope.sportId);
                })
                .error(function (data, status, headers, config) {
                    alert(data.Message);
            });
        }
        

        getMeetings($scope.sportId);
        getSportPlayers($scope.sportId);
        getSport($scope.sportId);
        getPlayers();

    }
]);