using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http.Results;
using CobaSports.Models.oauth;

namespace CobaSports
{
    public class AuthWebApiAttribute : Attribute, IAuthenticationFilter
    {
        public AuthWebApiAttribute(params string[] AllowedAnonymousActions)
        {
            _allowedAnonymousActions = AllowedAnonymousActions;
        }
        
        public bool AllowMultiple { get { return false; } }

        private string[] _allowedAnonymousActions { get; set; }

        public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            if (IsAuthorized(context.Request))
            {

            }
            else
            {
                if (_allowedAnonymousActions.Contains(context.Request.Method.Method)) return Task.FromResult(0);
                context.ErrorResult = new UnauthorizedResult(new[] { new AuthenticationHeaderValue("ExtAuth") }, context.Request);
            }
            return Task.FromResult(0);

        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            //there is no need to send a challenge here because it's already set in context.ErrorResult
            return Task.FromResult(0);
        }

        private bool IsAuthorized(HttpRequestMessage request)
        {
            if (request.Headers.Authorization == null) return false;
            string tokenValue = request.Headers.Authorization.Parameter;
            if(string.IsNullOrEmpty(tokenValue)) return false;

            ServerSessionObject sessionObject = SessionCache.GetServerSessionObject(tokenValue);
            if (sessionObject != null)
            {
                var claims = new List<Claim>();
                if (sessionObject.player != null)
                    claims.Add(new Claim(ClaimTypes.NameIdentifier, sessionObject.player.Id.ToString()));

                claims.Add(new Claim(ClaimTypes.Role, "Player"));

                var claimsIdentity = new ClaimsIdentity(claims);

                var principal = new ClaimsPrincipal(new[] {claimsIdentity});
                Thread.CurrentPrincipal = principal;
                HttpContext.Current.User = principal;
                
                return true;
            }
 
            return false;
        }
    }
}