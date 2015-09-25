angular.module('app.sessionServices', [])
    .factory('$session', function ($auth, $cookies, $http, $confirm, $alertService) {
        var sessionInstance = {};
    
        sessionInstance.logout = function () {
            $auth.logout().then(function () {
                // send a request to your server to perform server-side logout
                $http.post('/auth/logout', $cookies.getObject('session'))
                    .success(function () {
                        $cookies.remove('session');
                        $alertService.add('warning', 'You were logged out. Remember, you can stay logged in as long as you want.');
                    })
                    .error(function () {
                        $cookies.remove('session');
                        $alertService.add('danger', 'There were some error but anyway, you were logged out.');
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
                                $alertService.add('success', "Welcome back " + response.data.player.FirstName + "!");
                            } else {
                                $confirm({ text: "Welcome!!! Do you want access to CoBa Sports application?" })
                                    .then(function () {
                                        $http.post('/auth/createPlayer', $cookies.getObject('session'))
                                            .success(function (session) {
                                                if (session) {
                                                    $cookies.remove('session');
                                                    $cookies.putObject('session', session);
                                                    $alertService.add('success', 'Player ' + session.player.FirstName + ' ' + session.player.LastName + ' has been successfully created.');
                                                } else {
                                                    $alertService.add('danger', 'Oups!!! Something went wrong. :-(');
                                                }
                                            });
                                    });
                            }
                            return;
                        }
                    }
                    $alertService.add('danger', 'Oups!!! Something went wrong. :-(');
                });
        };

    return sessionInstance;
    });