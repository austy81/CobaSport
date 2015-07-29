angular.module('app').controller("authController", ["$scope", "$auth", "$confirm", "$http",
    function ($scope, $auth, $confirm, $http) {
        $scope.logout = function () {
            var token = $auth.getToken();
            $auth.logout().then(function() {
                // send a request to your server to perform server-side logout
                $http.post('/auth/logout', { 'sessionId': $auth.getToken() });
                }
            );
        };

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function(response) {
                    if (response.data) {
                        if (response.data.token) {
                            $auth.setToken(response.data.sessionId);
                            if (response.data.playerId) {
                                alert("Welcome back!");
                            } else {
                                $confirm({ text: "Welcome!!! Do you want access to CoBa Sports application?" })
                                    .then(function () {
                                        $http.post('/auth/createPlayer', { sessionId: $auth.getToken() })
                                            .success(function(player) {
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