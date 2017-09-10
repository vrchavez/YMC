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
    public class AppointmentService
    {
        private IDataProvider _prov;

        public AppointmentService(IDataProvider provider)
        {
            _prov = provider;
        }

        public List<Appointment> Get(AppointmentRequest model)
        {
            List<Appointment> list = null;
            _prov.ExecuteCmd("Appointment_Search",
                 inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PersonId", model.PersonId);
                    paramCollection.AddWithValue("@CriteriaStartDate", model.StartDate);
                    paramCollection.AddWithValue("@CriteriaEndDate", model.EndDate);
                },
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            Appointment e = new Appointment();
                            int ord = 0;
                            e.Id = rdr.GetSafeInt32(ord++);
                            e.Name = rdr.GetSafeString(ord++);
                            e.PersonId = rdr.GetSafeInt32(ord++);
                            e.Description = rdr.GetSafeString(ord++);
                            e.ProgramId = rdr.GetSafeInt32(ord++);
                            e.AppointmentTypeId = rdr.GetSafeInt32(ord++);
                            e.AppointmentTypeName = rdr.GetSafeString(ord++);
                            e.StartDate = rdr.GetSafeUtcDateTime(ord++);
                            e.EndDate = rdr.GetSafeUtcDateTime(ord++);

                            if (list == null)
                            {
                                list = new List<Appointment>();
                            }
                            list.Add(e);
                            break;
                        default:
                            break;
                    }
                });
                return list;
            }

        public void DeleteType(int Id)
        {
            _prov.ExecuteNonQuery("Appointment_Delete"
            , inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            });
        }

        public void PutType(AppointmentUpdateRequest model)
        {
            _prov.ExecuteNonQuery("Appointment_Update"
            , inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", model.Id);
                paramCollection.AddWithValue("@Name", model.Name);
                paramCollection.AddWithValue("@PersonId", model.PersonId);
                paramCollection.AddWithValue("@Description", model.Description);
                paramCollection.AddWithValue("@ProgramId", model.ProgramId);
                paramCollection.AddWithValue("@AppointmentTypeId", model.AppointmentTypeId);
                paramCollection.AddWithValue("@CriteriaStartDate", model.CriteriaStartDate);
                paramCollection.AddWithValue("@CriteriaEndDate", model.CriteriaEndDate);
            });
        }

        public void PostType(AppointmentAddRequest model)
        {
            _prov.ExecuteNonQuery("Appointment_Insert"
            , inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Name", model.Name);
                paramCollection.AddWithValue("@PersonId", model.PersonId);
                paramCollection.AddWithValue("@Description", model.Description);
                paramCollection.AddWithValue("@ProgramId", model.ProgramId);
                paramCollection.AddWithValue("@AppointmentTypeId", model.AppointmentTypeId);
                paramCollection.AddWithValue("@CriteriaStartDate", model.CriteriaStartDate);
                paramCollection.AddWithValue("@CriteriaEndDate", model.CriteriaEndDate);
            });
        }
    }
}
