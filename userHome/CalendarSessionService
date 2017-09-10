using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CalendarSessionService
    {
        private IDataProvider _prov;

        public CalendarSessionService(IDataProvider provider)
        {
            _prov = provider;
        }

        public List<CalendarSession> GetByMonth(CalendarSessionRequest model)
        {
            List<CalendarSession> item = null;
       

            _prov.ExecuteCmd("SelectSessionByDateAndRole",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PersonId", model.PersonId);
                    paramCollection.AddWithValue("@CriteriaStartDate", model.CriteriaStartDate);
                    paramCollection.AddWithValue("@CriteriaEndDate", model.CriteriaEndDate);
                },
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            CalendarSession s = new CalendarSession();
                            int ord = 0;

                            s.PersonId = rdr.GetSafeInt32(ord++);
                            s.SessionId = rdr.GetSafeInt32(ord++);
                            s.SessionName = rdr.GetSafeString(ord++);
                            s.StartDatetime = rdr.GetSafeDateTime(ord++);
                            s.EndDatetime = rdr.GetSafeDateTime(ord++);
                            if (item == null)
                            {
                                item = new List<CalendarSession>();
                            }
                            item.Add(s);
                            break;
                        default:
                            break;
                    }
                }
            );
            return item;
        }
    }
}
