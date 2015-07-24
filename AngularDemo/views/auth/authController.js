angular.module('app').controller("authController", ["$scope", "$auth", "$confirm",
    function ($scope, $auth, $confirm) {
        $scope.delete = function() {
            
        }

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