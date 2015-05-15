app.controller('sportListController', ['$scope', '$http', function ($scope, $http) {

    var apiUrl = 'http://localhost:56513/api';
    var apiController = '/Sport/';

    $scope.isCreatingNewMeeting = false;
    $scope.sportsList = [];

    var getSports = function () {
        $http.get(apiUrl + apiController)
            .success(function(data) {
                $scope.sportsList = data;
            });
    }

    $scope.deleteSport = function (id) {
        $http.delete(apiUrl + apiController + id).success(function() {
            getSports();
        });
    }

    $scope.createNewSport = function () {
        var data = { caption: $scope.newSport };
        $scope.newSport = '';

        $http.post(apiUrl + apiController, data)
            .success(function(data, status, headers, config) {
                getSports();
            })
            .error(function(data, status, headers, config) {
                
            });
    }

    getSports();
    
}]);