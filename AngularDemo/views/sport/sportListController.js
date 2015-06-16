app.controller('sportListController', ['$scope', '$modal', 'Sport', function ($scope, $modal, Sport) {

    $scope.sportsList = [];

    var sportsLoaded = function (data) {
        data.value.sort(compareCaption);
        $scope.sportsList = data.value;
    };

    var compareCaption = function(sportA, sportB) {
        if (sportA.Caption < sportB.Caption) return -1;
        if (sportA.Caption > sportB.Caption) return 1;
        return 0;
    };

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
            templateUrl: 'views/sport/sportEdit.html',
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