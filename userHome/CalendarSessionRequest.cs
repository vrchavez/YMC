using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class CalendarSessionRequest
    {
        public int PersonId { get; set; }
        public DateTime CriteriaStartDate { get; set; }
        public DateTime CriteriaEndDate { get; set; }
    }
}
