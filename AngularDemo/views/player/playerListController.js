app.controller('playerListController', ['$scope', '$http', '$modal', 'Player', function ($scope, $http, $modal, Player) {


    $scope.playerList = [];

    var getPlayers = function () {
        Player.query(function (data) {
            data.value.sort(compareLastName);
            $scope.playerList = data.value;
        });
    }

    $scope.deletePlayer = function(id) {
        Player.delete({ Id: id }, function() {
            getPlayers();
        });
    };

    var compareLastName = function (playerA, playerB) {
        if (playerA.LastName < playerB.LastName) return -1;
        if (playerA.LastName > playerB.LastName) return 1;
        return 0;
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