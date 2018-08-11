using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class VendorResponse : ResponseBase
    {
        public List<Vendors> data { get; set; }

        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telp { get; set; }
        public List<Prod> ListProduct { get; set; }
        public List<VendorTrans> ListVendor { get; set; }
    }

    public class VendorTrans
    {
        public int ID { get; set; }
        public string Nama { get; set; }
    }

    public class Vendors
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telp { get; set; }
        public List<Prod> ListProduct { get; set; }
    }

    public class Prod
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
    }
}