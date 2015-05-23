using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using CobaSports.Models;

namespace CobaSports
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services    
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
      
            builder.EntitySet<Sport>("Sports");
            builder.EntitySet<Player>("Players");
            builder.EntitySet<Meeting>("Meetings");
            builder.EntitySet<MeetingPlayer>("MeetingPlayers"); 
            builder.EntitySet<SportPlayer>("SportPlayers");

            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());

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
