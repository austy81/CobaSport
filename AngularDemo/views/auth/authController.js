angular.module('app').controller('authController',
    ['$scope', '$session',
    function ($scope, $session) {
        $scope.logout = function () {
            $session.logout();
        };

        $scope.loggedInPlayer = function () {
            return $session.loggedInPlayer();
        };

        $scope.authenticate = function(provider) {
            $session.authenticate(provider);
        };

    }
]);