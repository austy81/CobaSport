angular.module('app.sessionServices', [])
    .factory('$session', function ($auth, $cookies, $http, $confirm) {
        var sessionInstance = {};
    
        sessionInstance.logout = function () {
            $auth.logout().then(function () {
                // send a request to your server to perform server-side logout
                $http.post('/auth/logout', $cookies.getObject('session'))
                    .success(function () {
                        $cookies.remove('session');
                    })
                    .error(function () {
                        $cookies.remove('session');
                    });
            }
            );
        };

        sessionInstance.loggedInPlayer = function () {
            var sessionObject = $cookies.getObject('session');
            if (sessionObject && sessionObject.player && sessionObject.player.Id) {
                return sessionObject.player;
            }
            return null;
        };

        sessionInstance.authenticate = function (provider) {
            $auth.authenticate(provider)
                .then(function (response) {
                    if (response.data) {
                        if (response.data.token) {
                            $cookies.putObject('session', response.data);
                            if (response.data.player) {
                                alert("Welcome back!");
                            } else {
                                $confirm({ text: "Welcome!!! Do you want access to CoBa Sports application?" })
                                    .then(function () {
                                        $http.post('/auth/createPlayer', $cookies.getObject('session'))
                                            .success(function (session) {
                                                if (session) {
                                                    $cookies.remove('session');
                                                    $cookies.putObject('session', session);
                                                    alert('Player ' + session.player.FirstName + ' ' + session.player.LastName + ' has been successfully created.');
                                                } else {
                                                    alert('Oups!!! Something went wrong. :-(');
                                                }
                                            });
                                    });
                            }
                            return;
                        }
                    }
                    alert("Authentication was not successfull.");
                });
        };

    return sessionInstance;
});