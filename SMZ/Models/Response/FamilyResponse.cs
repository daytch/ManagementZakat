using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class FamilyResponse: ResponseBase
    {
        public List<CustomerFamily> data { get; set; }

        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class CustomerFamily
    {
        public string Name { get; set; }
        public List<Famz> ListFamily { get; set; }
    }
}