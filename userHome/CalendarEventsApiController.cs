using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Responses;
using Sabio.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/CalendarEvents")]
    public class CalendarEventsApiController : ApiController
    {
        CalendarEventService _svc;

        public CalendarEventsApiController(CalendarEventService svc)
        {
            _svc = svc;
        }

        [Route][HttpGet]
        public HttpResponseMessage GetByMonth([FromUri] CalendarEventRequest model)
        {
            ItemsResponse<CalendarEvent> response = new ItemsResponse<CalendarEvent>();
            response.Items = _svc.GetByMonth(model);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }


    }
}
