angular.module('app').controller("authController", ["$scope", "$auth", "$confirm", "$http", "$cookies",
    function ($scope, $auth, $confirm, $http, $cookies) {
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

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function(response) {
                    if (response.data) {
                        if (response.data.token) {
                            $cookies.putObject('session', response.data);
                            if (response.data.playerId) {
                                alert("Welcome back!");
                            } else {
                                $confirm({ text: "Welcome!!! Do you want access to CoBa Sports application?" })
                                    .then(function () {
                                        $http.post('/auth/createPlayer', $cookies.getObject('session'))
                                            .success(function (playerId) {
                                                var session = $cookies.getObject('session');
                                                session.playerId = playerId;

                                                $cookies.putObject('session', session);
                                                alert('Your player has been successfully created.');
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