using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class CalendarSession
    {
        public int SessionId { get; set; }
        public int PersonId { get; set; }
        public string SessionName { get; set; }
        public DateTime? StartDatetime { get; set; }
        public DateTime? EndDatetime { get; set; }
    }
}
