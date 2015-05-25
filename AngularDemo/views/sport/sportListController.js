app.controller('sportListController', ['$scope', '$http', '$modal', 'Sport', function ($scope, $http, $modal, Sport) {

    $scope.sportsList = [];

    var getSports = function () {
        Sport.query(function (data) { $scope.sportsList = data.value; });
    };

    $scope.deleteSport = function(id) {
        Sport.delete({ Id: id }, function() { getSports(); });
    };

    getSports();

    $scope.upsertSport = function (entity) {
        if (!entity) {
            entity = { Caption: '' };
            $scope.sportsList.push(entity);
        };

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'sportEdit.html',
            controller: 'entityEditController',
            resolve: {
                modalObject: function () {
                    return {
                        apiController: Sport,
                        entity: entity
                        };
                }
            }
        });

        var success = function(data) {
            entity.Id = data.Id;
        };

        var error = function() {
            getSports();
        };

        modalInstance.result.then(success, error);
    };

}]);