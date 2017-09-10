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
    [RoutePrefix("api/CalendarSession")]
    public class CalendarEventsApiController : ApiController
    {
        CalendarSessionService _svc;

        public CalendarEventsApiController(CalendarSessionService svc)
        {
            _svc = svc;
        }

        [Route][HttpGet]
        public HttpResponseMessage GetByMonth([FromUri] CalendarSessionRequest model)
        {
            ItemsResponse<CalendarSession> response = new ItemsResponse<CalendarSession>();
            response.Items = _svc.GetByMonth(model);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }


    }
}
