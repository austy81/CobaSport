app.controller('playerEditController', ['$scope', '$http', '$modalInstance', 'player', function ($scope, $http, $modalInstance, player) {

    var apiUrl = 'http://localhost:56513/api';
    var apiController = '/Player/';

    $scope.player = player;

    $scope.ok = function () {
        $scope.upadatePlayer();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.upadatePlayer = function () {
        var data = $scope.player;

        $http.post(apiUrl + apiController, data)
            .success(function (data, status, headers, config) {
                $scope.player = data;
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                alert(data.message);
            });
    };

}]);