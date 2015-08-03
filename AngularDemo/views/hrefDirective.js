angular.module('app').directive('unihref', ['$location', function ($location) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            //element.attr('class', 'clickable');
            element.addClass('clickable');
            element.on('click', function () {
                $location.path(attr.unihref);
                scope.$apply();
            });
        }
    }
}]);