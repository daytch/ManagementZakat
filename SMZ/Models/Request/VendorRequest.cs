using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class VendorRequest:RequestBase
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telp { get; set; }
        public List<Prod> ListProduct { get; set; }

        public string Action { get; set; }
    }
}