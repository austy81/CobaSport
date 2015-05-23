app.controller('sportListController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {

    var apiUrl = 'http://localhost:56513/odata';
    var apiController = '/Sports/';

    $scope.sportsList = [];

    var getSports = function () {
        $http.get(apiUrl + apiController)
            .success(function (data) {
                $scope.sportsList = data.value;
            });
    }

    $scope.deleteSport = function (id) {
        $http.delete(apiUrl + apiController + id).success(function () {
            getSports();
        });
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
            //size: size,
            resolve: {
                modalObject: function () {
                    return {
                        apiController: apiController,
                        entity: entity
                        };
                }
            }
        });

        modalInstance.result.then(function () {
            //success - nothing to do
        }, function () {
            getSports();
            //var index = $scope.sportsList.indexOf(data);
            //if (index > -1) {
            //    $scope.sportsList.splice(index, 1);
            //};
        });
    };

}]);