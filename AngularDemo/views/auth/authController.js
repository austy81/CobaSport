angular.module('app').controller("authController", ["$scope", "$auth", "$confirm", "$http",
    function ($scope, $auth, $confirm, $http) {
        $scope.logout = function () {
            var token = $auth.getToken();
            $auth.logout().then(function() {
                    // send a request to your server to perform server-side logout
                    $http.post('/auth/logout', token);
                }
            );
        };

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function(response) {
                    if (response.data) {
                        if (response.data.token) {
                            $auth.setToken(response.data.token);
                            if (response.data.player) {
                                alert("Welcome back " + response.data.FirstName + " !!!");
                                return;
                            }

                            if (response.data.userInfo) {
                                $confirm({ text: "Welcome " + response.data.userInfo.FirstName + " !!! Do you want access to CoBa Sports application?" })
                                    .then(function () {
                                        alert('YES');
                                    });
                                return;
                            }
                            return;
                        }
                    }
                    alert("Authentication was not successfull.");
                });
        };

    }
]);