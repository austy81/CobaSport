app.controller('playersController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        var apiUrl = 'http://localhost:56513/odata';
        var apiController = '/player/';
        var apiSportsController = '/sport/';

        $scope.selectedSportId = 0;
        if ($routeParams.sportId) selectedSportId = $routeParams.sportId;

        $scope.playersList = [];
        $scope.isCreatingNewPlayer = false;
        $scope.sports = [];

        $scope.toggleIsCreatingNewPlayer = function() {
            $scope.isCreatingNewPlayer = !$scope.isCreatingNewPlayer;
        }

        $scope.$watch('selectedSportId', function (newVal, oldVal) {
            console.log(oldVal + 'changed to:' + newVal);
        }, true);

        var getSports = function (sportId) {
            var requestUrl = apiUrl + apiSportsController;
            if (sportId > 0) requestUrl += sportId;

            $scope.sports = [{ Id: 0, Caption: 'All' }];
            $http.get(requestUrl)
                .success(function(data) {
                var index;
                for (index = 0; index < data.length; ++index) {
                    $scope.sports.push(data[index]);
                }
            });
        }

        var getPlayers = function(sportId) {
            $http.get(apiUrl + apiController)
                .success(function (data) {
                    $scope.playersList = [];
                    var index;
                    for (index = 0; index < data.length; ++index) {
                        //if (data[index].SportId == sportId)
                            $scope.playersList.push(data[index]);
                    }
                });
        }

        $scope.deletePlayer = function (id) {
            if (confirm("Are you sure to delete this player?")) {
                $http.delete(apiUrl + apiController + id).success(function() {
                    getPlayers($scope.selectedSportId);
                });
            }
        }

        $scope.createNewPlayer = function() {

            var data = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName
                //SportId: selectedSportId
            };
            $scope.newplayer = '';

            $http.post(apiUrl + apiController, data)
                .success(function(data, status, headers, config) {
                    getPlayers($scope.selectedSportId);
                })
                .error(function(data, status, headers, config) {

                });
        }

        getPlayers($scope.selectedSportId);
        getSports($scope.selectedSportId);

    }
]);