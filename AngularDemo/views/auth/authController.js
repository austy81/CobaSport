angular.module('app').controller("authController", ["$scope", "$auth", "$confirm", "$http", "$cookies", "Player",
    function ($scope, $auth, $confirm, $http, $cookies, Player) {
        $scope.logout = function () {
            $auth.logout().then(function() {
                // send a request to your server to perform server-side logout
                $http.post('/auth/logout', $cookies.getObject('session'))
                    .success(function () {
                        $cookies.remove('session');
                    });
                }
            );
        };

        $scope.loggedIn = function() {
            var sessionObject = $cookies.getObject('session');
            if (sessionObject && sessionObject.player && sessionObject.player.Id)
                return sessionObject.player;

            return null;
        };

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function(response) {
                    if (response.data) {
                        if (response.data.token) {
                            $cookies.putObject('session', response.data);
                            if (response.data.player) {
                                alert("Welcome back!");
                            } else {
                                $confirm({ text: "Welcome!!! Do you want access to CoBa Sports application?" })
                                    .then(function () {
                                        $http.post('/auth/createPlayer', $cookies.getObject('session'))
                                            .success(function (playerId) {
                                                var session = $cookies.getObject('session');
                                                session.playerId = playerId;
                                                $cookies.putObject('session', session);

                                                Player.query({ Id: session.player.Id }, function (player) {
                                                    alert('Player ' + player.FirstName + ' ' + player.LastName + ' has been successfully created.');
                                                });
                                            });
                                    });
                            }
                            return;
                        }
                    }
                    alert("Authentication was not successfull.");
                });
        };

    }
]);