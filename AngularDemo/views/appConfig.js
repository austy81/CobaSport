    angular.module('app.config',[])
        .constant('appConfig', 
            {
                //https://github.com/sahat/satellizer
                authProvider: {
                    google: {
                        //clientId: '815231347440-p39g1jdncc1fju23o5nm4n4ho94t72g3.apps.googleusercontent.com',
                        clientId: '815231347440-53sfdf6q7u9q489ln8ch8nno289dagf2.apps.googleusercontent.com',
                        url: '/auth/login'
                    }
                    //facebook: {
                    //    clientId: '624059410963642'
                    //});
                    //github: {
                    //    clientId: '0ba2600b1dbdb756688b'
                    //});

                    //linkedin: {
                    //    clientId: '77cw786yignpzj'
                    //});

                    //yahoo: {
                    //    clientId: 'dj0yJmk9dkNGM0RTOHpOM0ZsJmQ9WVdrOVlVTm9hVk0wTkRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMA--'
                    //});

                    //live: {
                    //    clientId: '000000004C12E68D'
                    //});

                    //twitter: {
                    //    url: '/auth/twitter'
                    //});

                    //oauth2: {
                    //    name: 'foursquare',
                    //    url: '/auth/foursquare',
                    //    redirectUri: window.location.origin,
                    //    clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
                    //    authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
                    //});
                }
            }
        )

