app.controller('playerListController', ['$scope', '$http', '$modal', 'Player', function ($scope, $http, $modal, Player) {


    $scope.playerList = [];

    var getPlayers = function () {
        Player.query(function(data) {
            $scope.playerList = data.value;
        });
    }

    $scope.deletePlayer = function(id) {
        Player.delete({ Id: id }, function() {
            getPlayers();
        });
    };

    getPlayers();

    $scope.upsertPlayer = function (entity) {

        if (!entity) {
            entity = { FirstName: '', LastName: '' };
            $scope.playerList.push(entity);
        };

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'playerEdit.html',
            controller: 'entityEditController',
            resolve: {
                modalObject: function () {
                    return {
                        apiController: Player,
                        entity: entity
                    };
                }
            }
        });

        modalInstance.result.then(function () {
            //success - nothing to do
        }, function () {
            //error
            getPlayers();
        });
    };

}]);