angular.module('app').controller('formHeaderController', [
        '$scope', function($scope) {
            $scope.searchtext
        }
]);

angular.module('app').directive('formheader', function () {
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