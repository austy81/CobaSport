angular.module('app').controller('entityEditController', ['$scope', '$http', '$modalInstance', 'modalObject', function ($scope, $http, $modalInstance, modalObject) {

    $scope.entity = modalObject.entity;
    $scope.selects = modalObject.selects;

    $scope.ok = function () {
        $scope.upadateEntity();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    var success = function(data) {
        $modalInstance.close(data);
    };

    var fail = function(data) {
        alert(data.statusText);
    }

    $scope.upadateEntity = function () {

        if ($scope.entity.Id) {
            modalObject.apiController.update({ Id: $scope.entity.Id }, $scope.entity, success, fail);
        }
        else {
            modalObject.apiController.save($scope.entity,success,fail);
        };

    };

}]);