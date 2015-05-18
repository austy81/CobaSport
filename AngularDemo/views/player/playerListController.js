app.controller('playerListController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {

    var apiUrl = 'http://localhost:56513/api';
    var apiController = '/Player/';

    $scope.playerList = [];

    var getPlayers = function () {
        $http.get(apiUrl + apiController)
            .success(function (data) {
                $scope.playerList = data;
            });
    }

    $scope.deletePlayer = function (id) {
        $http.delete(apiUrl + apiController + id).success(function () {
            getPlayers();
        });
    };


    getPlayers();

    $scope.upsertPlayer = function (player) {
        var data;
        if (player) {
            data = player;
        }
        else {
            var data = { Id: null, FirstName: '', LastName: '' };
            $scope.playerList.push(data);
        };

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'playerEdit.html',
            controller: 'entityEditController',
            //size: size,
            resolve: {
                modalObject: function () {
                    return {
                        apiController: '/player/',
                        entity: data
                    };
                }
            }
        });

        modalInstance.result.then(function () {
            //success - nothing to do
        }, function () {
            getPlayers();
            //var index = $scope.sportsList.indexOf(data);
            //if (index > -1) {
            //    $scope.sportsList.splice(index, 1);
            //};
        });
    };

}]);