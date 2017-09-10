using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class AppointmentTypeService
    {
        private IDataProvider _prov;

        public AppointmentTypeService(IDataProvider provider)
        {
            _prov = provider;
        }

        public List<AppointmentType> Get()
        {
            List<AppointmentType> list = null;
            _prov.ExecuteCmd("AppointmentType_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            AppointmentType e = new AppointmentType();
                            int ord = 0;
                            e.Id = rdr.GetSafeInt32(ord++);
                            e.Name = rdr.GetSafeString(ord++);

                            if (list == null)
                            {
                                list = new List<AppointmentType>();
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
            _prov.ExecuteNonQuery("AppointmentType_Delete"
            , inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            });
        }

        public void PutType(AppointmentType model)
        {
            _prov.ExecuteNonQuery("AppointmentType_Update"
            , inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", model.Id);
                paramCollection.AddWithValue("@Name", model.Name);
            });
        }

        public void PostType(string Name)
        {
            _prov.ExecuteNonQuery("AppointmentType_Insert"
            , inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Name", Name);
            });
        }
    }
}
