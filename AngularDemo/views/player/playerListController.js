angular.module('app').controller('playerListController', ['$scope', '$modal', 'Player', '$location', function ($scope, $modal, Player, $location) {

    $scope.playerList = [];

    var compareLastName = function (playerA, playerB) {
        if (playerA.LastName < playerB.LastName) return -1;
        if (playerA.LastName > playerB.LastName) return 1;
        return 0;
    };

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

    $scope.redirectToPlayer = function(playerId) {
        $location.path('/players/' + playerId);
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
            getPlayers();
        }, function () {
            //error
            getPlayers();
        });
    };

}]);