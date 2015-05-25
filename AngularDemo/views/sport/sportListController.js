app.controller('sportListController', ['$scope', '$http', '$modal', 'Sport', function ($scope, $http, $modal, Sport) {

    var apiUrl = 'http://localhost:56513/odata';
    var apiController = '/Sports/';

    $scope.sportsList = [];

    var getSports = function () {
        Sport.query(function (data) { $scope.sportsList = data.value; });
    };

    //var getSports = function () {
    //    $http.get(apiUrl + apiController)
    //        .success(function (data) {
    //            $scope.sportsList = data.value;
    //        });
    //}

    $scope.deleteSport = function(id) {
        //$http.delete(apiUrl + apiController + id).success(function() {
        //    getSports();
        //});
        Sport.delete({ Id: id }, function() { getSports(); });
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
            resolve: {
                modalObject: function () {
                    return {
                        apiController: Sport,
                        entity: entity
                        };
                }
            }
        });

        var success = function(data) {
            entity.Id = data.Id;
        };

        var error = function() {
            getSports();
            //var index = $scope.sportsList.indexOf(data);
            //if (index > -1) {
            //    $scope.sportsList.splice(index, 1);
            //};
        };

        modalInstance.result.then(success, error);
    };

}]);