app.controller('sportListController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {

    var apiUrl = 'http://localhost:56513/api';
    var apiController = '/Sport/';

    $scope.sportsList = [];

    var getSports = function () {
        $http.get(apiUrl + apiController)
            .success(function (data) {
                $scope.sportsList = data;
            });
    }

    $scope.deleteSport = function (id) {
        $http.delete(apiUrl + apiController + id).success(function () {
            getSports();
        });
    };


    getSports();

    $scope.upsertSport = function (sport) {
        var data;
        if (sport) {
            data = sport;
        }
        else {
            var data = { Id: null, Caption: '' };
            $scope.sportsList.push(data);
        };

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'sportEdit.html',
            controller: 'entityEditController',
            //size: size,
            resolve: {
                modalObject: function () {
                    return {
                        apiController: '/sport/',
                        entity: data
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