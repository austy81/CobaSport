app.controller('sportListController', ['$scope', '$modal', 'Sport', function ($scope, $modal, Sport) {

    $scope.sportsList = [];

    var sportsLoaded = function(data) { $scope.sportsList = data.value; };

    $scope.deleteSport = function(id) {
        Sport.delete({ Id: id }, function () { Sport.query(sportsLoaded); });
    };

    Sport.query(sportsLoaded);

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

        var upsertSuccess = function(data) {
            entity.Id = data.Id;
        };

        var upsertError = function() {
            Sport.query(sportsLoaded);
        };

        modalInstance.result.then(upsertSuccess, upsertError);
    };

}]);