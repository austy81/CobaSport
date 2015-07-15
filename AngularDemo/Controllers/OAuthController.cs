using System;
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

namespace CobaSports.Controllers
{
    public class OAuthController : ApiController
    {
        private CobaSportsContext db = new CobaSportsContext();

        [Route("auth/google")]
        public async Task<Player> AuthenticateGoogle([FromBody] GoogleAuth auth)
        {
            var googleTokenRequest = new NameValueCollection();
            googleTokenRequest.Add("client_id",auth.clientId);
            googleTokenRequest.Add("code", auth.code);
            googleTokenRequest.Add("client_secret", "lOMh8456jeSTDgbGea4hzCOR");
            googleTokenRequest.Add("grant_type", "authorization_code");
            googleTokenRequest.Add("redirect_uri", "http://localhost:56513");
            googleTokenRequest.Add("scope", "");

            string requestPayload = String.Join("&", googleTokenRequest.AllKeys.Select(a => a + "=" + HttpUtility.UrlEncode(googleTokenRequest[a])));
            
            using (var client = new HttpClient())
            {
                //FIRST VERSION
                HttpContent content = new StringContent(requestPayload);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
                client.BaseAddress = new Uri("https://www.googleapis.com/");
                //client.DefaultRequestHeaders.Accept.Clear();
                //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

                HttpResponseMessage response = await client.PostAsync("oauth2/v3/token", content);
                if (response.IsSuccessStatusCode)
                {
                    string tokenResponse = await response.Content.ReadAsStringAsync();
                    if (tokenResponse.Length > 0)
                    { }
                }

                //OTHER VERSION
                //HttpClient httpClient = new HttpClient();
                //HttpContent content = new StringContent(@"{ ""Username"": """ + "etc." + @"""}");
                //content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                //HttpResponseMessage response =
                //    await httpClient.PostAsync("http://myapi.com/authentication", content);
                //string statusCode = response.StatusCode.ToString();
            }

            return db.Players.FirstOrDefault(x => x.Email == "");
        }
    }
}
