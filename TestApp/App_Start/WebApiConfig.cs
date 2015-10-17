using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TestApp.WebUtils;

namespace TestApp
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // remove the XML formatter, just in case
            GlobalConfiguration.Configuration.Formatters.XmlFormatter.SupportedMediaTypes.Clear();

            // sets the return media type properly for requests that are using the xml media type
            // http://stackoverflow.com/questions/9847564/how-do-i-get-asp-net-web-api-to-return-json-instead-of-xml-using-chrome/20556625#20556625
            // scroll down for Todd Menier's answer and explanation.
            config.Formatters.Add(new BrowserJsonFormatter());
        }
    }
}
