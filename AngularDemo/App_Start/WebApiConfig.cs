using System.Web.Http;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using CobaSports.Models;

namespace CobaSports
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services    
            var builder = new ODataConventionModelBuilder();
      
            builder.EntitySet<Sport>("Sports");
            builder.EntitySet<Player>("Players");
            builder.EntitySet<Meeting>("Meetings");
            builder.EntitySet<MeetingPlayer>("MeetingPlayers"); 
            builder.EntitySet<SportPlayer>("SportPlayers");

            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());

            // Web API routes
            //config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            //config.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = 
            //    Newtonsoft.Json.PreserveReferencesHandling.Objects;

            //config.Formatters.Remove(config.Formatters.XmlFormatter);
        }
    }
}
