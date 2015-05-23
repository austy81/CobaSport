app.controller('sportDetailController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        var apiUrl = 'http://localhost:56513/odata';
        var apiMeetings = '/Meetings/';
        var apiSports = '/Sports/';
        var apiPlayers = '/Players/';
        var apiSportPlayerCreate = '/SportPlayers/';
        var apiSportPlayerDelete = '/SportPlayers/sport/{sportId}/player/{playerId}';
        var apiSportPlayer = '/SportPlayers/sport/{sportId}/players';

        $scope.meetings = [];
        $scope.players = [];
        $scope.sportPlayers = [];
        $scope.sport = {};
        $scope.isCreatingNewMeeting = false;
        $scope.sportId = $routeParams.sportId;

        var getSport = function(sportId) {
            $http.get(apiUrl + apiSports + sportId)
                .success(function(data) {
                    $scope.sport = data;
                });
        };

        var getPlayers = function () {
            $http.get(apiUrl + apiPlayers)
                .success(function (data) {
                    $scope.players = data;
                });
        };

        var getMeetings = function(sportId) {
            $http.get(apiUrl + apiMeetings)
                .success(function(data) {
                    $scope.meetings = [];
                    var index;
                    for (index = 0; index < data.length; ++index) {
                        if (data[index].SportId == sportId)
                            $scope.meetings.push(data[index]);
                    }
                });
        };

        var getSportPlayers = function(sportId) {
            $http.get(apiUrl + apiSportPlayer.replace('{sportId}',sportId))
                .success(function (data) {
                    $scope.sportPlayers = data;
                });
        };

        $scope.deleteMeeting = function(id) {
            $http.delete(apiUrl + apiMeetings + id).success(function () {
                getMeetings($scope.sportId);
            });
        };

        $scope.deletePlayer = function (playerId) {
            var url = apiUrl + apiSportPlayerDelete.replace('{playerId}', playerId).replace('{sportId}',$scope.sportId);
            $http.delete(url).success(function () {
                getSportPlayers($scope.sportId);
            });
        };

        $scope.createNewMeeting = function() {
            var data = {
                Timestamp: $scope.newMeetingDate,
                SportId: $scope.sportId
            };
            $scope.newMeeting = '';
            $http.post(apiUrl + apiMeetings, data)
                .success(function(data, status, headers, config) {
                    getMeetings($scope.sportId);
                })
                .error(function(data, status, headers, config) {

                });
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

        $scope.today = function () {
            $scope.newMeetingDate = new Date();
        };
        $scope.today();

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

    }
]);