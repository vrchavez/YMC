using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class AppointmentAddRequest
    {
        public string Name { get; set; }
        public int PersonId { get; set; }
        public string Description { get; set; }
        public int? ProgramId { get; set; }
        public int? AppointmentTypeId { get; set; }
        public DateTime CriteriaStartDate { get; set; }
        public DateTime CriteriaEndDate { get; set; }
    }
}
