app.controller('sportEditController', ['$scope', '$http', '$modalInstance', 'sport', function ($scope, $http, $modalInstance, sport) {

    var apiUrl = 'http://localhost:56513/api';
    var apiController = '/Sport/';

    $scope.sport = sport;

    $scope.ok = function () {
        $scope.upadateSport();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.upadateSport = function () {
        var data = $scope.sport;

        $http.post(apiUrl + apiController, data)
            .success(function (data, status, headers, config) {
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                alert(data.message);
            });
    };

}]);