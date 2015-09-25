using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using OAuth2;

namespace CobaSports.Controllers
{
    public class ConstantsController : ApiController
    {
        [Route("appConfig"), HttpGet]
        public HttpResponseMessage appConfig()
        {
            var authRoot = new AuthorizationRoot();
            string googleClientId = authRoot.Clients.Single(x => x.Configuration.ClientTypeName == "GoogleClient").Configuration.ClientId;
            string facebookClientId = authRoot.Clients.Single(x => x.Configuration.ClientTypeName == "FacebookClient").Configuration.ClientId;

            string js = @"
angular.module('app.config',[])
    .constant('appConfig', 
        {
            //https://github.com/sahat/satellizer
            authProvider: {
                google: {
                    clientId: '" + googleClientId + @"',
                    url: '/auth/login'
                },

                facebook: {
                    clientId: '" + facebookClientId + @"',
                    url: '/auth/login'
                }

            }
        }
    )
";
            var response = new HttpResponseMessage()
            {
                Content = new StringContent(js)
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/javascript");
            return response;
        }
    }
}
