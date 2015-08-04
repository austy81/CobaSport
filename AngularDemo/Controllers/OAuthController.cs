﻿using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;
using CobaSports.Models;
using CobaSports.Models.oauth;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OAuth2;
using OAuth2.Models;
using OAuth2.Client;

namespace CobaSports.Controllers
{
    public class OAuthController : ApiController
    {
        private readonly CobaSportsContext db = new CobaSportsContext();

        [Route("auth/login"), HttpPost]
        public async Task<IHttpActionResult> Authenticate([FromBody] AuthResponse authResponse)
        {
            if (authResponse == null) return BadRequest();
            //Random rnd = new Random();
            //var demoToken = new ServerSessionObject()
            //{
            //    token = rnd.Next(100, 999).ToString(),
            //    //sessionId = Guid.NewGuid().ToString(),
            //    userInfo = new UserInfo()
            //    {
            //        Email = "hausterlitz@gmail.com",
            //        FirstName = "Honza",
            //        LastName = "Austerlitz",
            //        Id = Guid.NewGuid().ToString(),
            //        ProviderName = "Google"
            //    },
            //    player = db.Players.FirstOrDefault(x=>x.Email=="hausterlitz@gmail.com")
            //};
            //SessionCache.AddOrUpdate(demoToken);
            //return Ok(SessionCache.GetClientSessionObject(demoToken.token));


            var authRoot = new AuthorizationRoot();

            OAuth2Client client;
            try
            {
                client = (OAuth2Client) authRoot.Clients.Single(c => c.Configuration.ClientId == authResponse.clientId);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
            if (client == null) return InternalServerError();


            var tokenRequest = new NameValueCollection();
            tokenRequest.Add("client_id", client.Configuration.ClientId);
            tokenRequest.Add("code", authResponse.code);
            tokenRequest.Add("client_secret", client.Configuration.ClientSecret);
            tokenRequest.Add("grant_type", "authorization_code");
            tokenRequest.Add("redirect_uri", client.Configuration.RedirectUri);
            tokenRequest.Add("scope", client.Configuration.Scope);

            UserInfo userInfo;
            try
            {
                userInfo = client.GetUserInfo(tokenRequest);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
            //userInfo = await GetUserInfoGoogle(tokenRequest);

            var serverSessionObject = new ServerSessionObject()
            {
                //sessionId = Guid.NewGuid().ToString(),
                token = client.AccessToken,
                userInfo = userInfo
            };

            if (userInfo != null)
            {
                Player player =
                    db.Players.FirstOrDefault(
                        x => x.UserInfos.Any(ui =>
                            ui.ProviderName.ToLower() == client.Name.ToLower() &&
                            ui.Id == userInfo.Id));

                serverSessionObject.player = player;
            }
            SessionCache.AddOrUpdate(serverSessionObject);
            return Ok(SessionCache.GetClientSessionObject(serverSessionObject.token));
        }

        [Route("auth/logout"), HttpPost]
        public IHttpActionResult Logout([FromBody] ClientSessionObject clientSession)
        {
            if (clientSession == null) return BadRequest();
            if (!SessionCache.Remove(clientSession.token)) return BadRequest();
            return Ok();
        }

        [Route("auth/createPlayer"), HttpPost]
        public IHttpActionResult CreatePlayer([FromBody] ClientSessionObject clientSession)
        {
            if (clientSession == null) return BadRequest();
            if (clientSession.token == null) return BadRequest();

            var serverSessionObject = SessionCache.GetServerSessionObject(clientSession.token);
            if (serverSessionObject == null) return NotFound();

            var player = new Player
            {
                Email = serverSessionObject.userInfo.Email,
                FirstName = serverSessionObject.userInfo.FirstName,
                LastName = serverSessionObject.userInfo.LastName,
                UserInfos = new List<UserInfo>() {serverSessionObject.userInfo},
            };

            db.Players.Add(player);
            db.SaveChanges();

            serverSessionObject.player = player;
            SessionCache.AddOrUpdate(serverSessionObject);

            return Ok(SessionCache.GetClientSessionObject(clientSession.token));
        }



        //private async Task<UserInfo> GetUserInfoGoogle(NameValueCollection googleTokenRequest)
        //{
        //    string requestPayload = String.Join("&",
        //        googleTokenRequest.AllKeys.Select(a => a + "=" + HttpUtility.UrlEncode(googleTokenRequest[a])));

        //    using (var client = new HttpClient())
        //    {
        //        HttpContent content = new StringContent(requestPayload);
        //        content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
        //        client.BaseAddress = new Uri("https://www.googleapis.com/");

        //        HttpResponseMessage responseToken = await client.PostAsync("oauth2/v3/token", content);
        //        if (responseToken.IsSuccessStatusCode)
        //        {
        //            string tokenResponse = await responseToken.Content.ReadAsStringAsync();
        //            if (tokenResponse.Length > 0)
        //            {
        //                try
        //                {
        //                    var json = (JObject) JsonConvert.DeserializeObject(tokenResponse);
        //                    string token = json["access_token"].ToString();

        //                    HttpResponseMessage responseProfile = await client.GetAsync("plus/v1/people/" + token);
        //                }
        //                catch (Exception ex)
        //                {
        //                }
        //            }
        //        }

        //    }
        //    return null;
        //}
    }
}

