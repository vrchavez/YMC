using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class Appointment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PersonId { get; set; }
        public string Description { get; set; }
        public int ProgramId { get; set; }
        public int AppointmentTypeId { get; set; }
        public string AppointmentTypeName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
