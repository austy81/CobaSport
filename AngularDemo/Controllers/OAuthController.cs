﻿using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
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
        private CobaSportsContext db = new CobaSportsContext();

        [Route("auth/google")]
        public Token Authenticate([FromBody] AuthResponse authResponse)
        {
            if (authResponse == null) return null;

            var authRoot = new AuthorizationRoot();

            OAuth2Client client;
            try
            {
                client = (OAuth2Client)authRoot.Clients.Single(c => c.Configuration.ClientId == authResponse.clientId);
            }
            catch
            {
                return null;
            }
            if (client == null) return null;


            var tokenRequest = new NameValueCollection();
            tokenRequest.Add("client_id", client.Configuration.ClientId);
            tokenRequest.Add("code", authResponse.code);
            tokenRequest.Add("client_secret", client.Configuration.ClientSecret);
            tokenRequest.Add("grant_type", "authorization_code");
            tokenRequest.Add("redirect_uri", client.Configuration.RedirectUri);
            tokenRequest.Add("scope", client.Configuration.Scope);

            try
            {
                var userInfo = client.GetUserInfo(tokenRequest);

                var token = new Token() { token = client.AccessToken };
                return token;
            }
            catch 
            {
                return null;
            }
        }

        //[Route("auth/google")]
        //public async Task<Player> AuthenticateGoogle([FromBody] GoogleAuth auth)
        //{
        //    var googleTokenRequest = new NameValueCollection();
        //    googleTokenRequest.Add("client_id",auth.clientId);
        //    googleTokenRequest.Add("code", auth.code);
        //    googleTokenRequest.Add("client_secret", "lOMh8456jeSTDgbGea4hzCOR");
        //    googleTokenRequest.Add("grant_type", "authorization_code");
        //    googleTokenRequest.Add("redirect_uri", "http://localhost:56513");
        //    googleTokenRequest.Add("scope", "");

        //    string requestPayload = String.Join("&", googleTokenRequest.AllKeys.Select(a => a + "=" + HttpUtility.UrlEncode(googleTokenRequest[a])));
            
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
        //                    var json = (JObject)JsonConvert.DeserializeObject(tokenResponse);
        //                    string token = json["access_token"].ToString();

        //                    HttpResponseMessage responseProfile = await client.GetAsync("plus/v1/people/" + token);
        //                }
        //                catch (Exception ex) 
        //                { 
        //                }
        //            }
        //        }

        //    }

        //    return db.Players.FirstOrDefault(x => x.Email == "");
        //}
    }
}
