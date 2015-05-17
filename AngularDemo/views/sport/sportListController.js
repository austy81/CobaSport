app.controller('sportListController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {

    var apiUrl = 'http://localhost:56513/api';
    var apiController = '/Sport/';

    $scope.isCreatingNewMeeting = false;
    $scope.sportsList = [];
    $scope.sport = { Caption: 'exooooot' };

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

    $scope.editSport = function () {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'sportEdit.html',
            controller: 'sportEditController',
            //size: size,
            resolve: {
                sport: function () {
                    return $scope.sport;
                }
            }
        });

        modalInstance.result.then(function (sport) {
            getSports();
        }, function () {
            //dismiss
        });
    };

}]);