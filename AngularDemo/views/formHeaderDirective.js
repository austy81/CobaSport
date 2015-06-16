app.controller('formHeaderController', [
        '$scope', function($scope) {
            $scope.searchtext
        }
    ]);
app.directive('formheader', function () {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            buttonlabel: '@',
            buttonaction: '&',
            searchtext : '&'
        },
        templateUrl: 'views/formHeader.html',
        controller: 'formHeaderController'
    };
});