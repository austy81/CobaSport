﻿app.controller('entityEditController', ['$scope', '$http', '$modalInstance', 'modalObject', function ($scope, $http, $modalInstance, modalObject) {

    var apiUrl = 'http://localhost:56513/odata';
    var apiController = modalObject.apiController;
    $scope.entity = modalObject.entity;

    $scope.ok = function () {
        $scope.upadateEntity();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.upadateEntity = function () {
        var data = $scope.entity;

        if ($scope.entity.Id)
            $http.put(apiUrl + apiController, data)
                    .success(function () {
                        $modalInstance.close();
                    })
                    .error(function (data, status, headers, config) {
                        alert(data.message);
                    });
        else
            $http.post(apiUrl + apiController, data)
                .success(function (data, status, headers, config) {
                    $scope.entity = data;
                    $modalInstance.close();
                })
                .error(function (data, status, headers, config) {
                    alert(data.message);
                });
    };

}]);