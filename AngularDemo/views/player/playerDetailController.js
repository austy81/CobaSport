angular.module('app').controller('playerDetailController', ['$scope', '$modal', 'Player', '$routeParams',
    function ($scope, $modal, Player, $routeParams) {

        $scope.playerId = $routeParams.playerId;

        Player.query({
            $select: 'Id,FirstName,LastName,Email',
            $expand: 'SportPlayers($expand=Sport),MeetingPlayers($expand=Meeting($expand=Sport))',
            $filter: 'Id eq ' + $scope.playerId
        }, function (data) {
            if(data.value && data.value.length > 0)
            $scope.player = data.value[0];
        });

    }
]);