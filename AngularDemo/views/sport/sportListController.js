angular.module('app').controller('sportListController', ['$scope', '$modal', 'Sport', '$alertService', function ($scope, $modal, Sport, $alertService) {

    $scope.sportsList = [];

    var compareCaption = function (sportA, sportB) {
        if (sportA.Caption < sportB.Caption) return -1;
        if (sportA.Caption > sportB.Caption) return 1;
        return 0;
    };

    var sportsLoaded = function (data) {
        data.value.sort(compareCaption);
        $scope.sportsList = data.value;
    };

    $scope.deleteSport = function(id) {
        Sport.delete({ Id: id }, function () { Sport.query(sportsLoaded); });
        $alertService.add('success', 'Sport was deleted.');
    };

    Sport.query({ $expand: 'SportPlayers($select=Id),Meetings($select=Id)' }, sportsLoaded);

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
            $alertService.add('success', 'Sport was added.');
        };

        var upsertError = function() {
            Sport.query(sportsLoaded);
            $alertService.add('error', 'There were some error during adding of sport.');
        };

        modalInstance.result.then(upsertSuccess, upsertError);
    };

}]);