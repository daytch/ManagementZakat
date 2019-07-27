using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class ProductRequest:RequestBase
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public decimal? Price { get; set; }
        public int  VendorID { get; set; }
        public int ClassID { get; set; }
        public string ProductCode { get; set; }
        public string Image { get; set; }
        public int LastNumber { get; set; }
        public int? Stok { get; set; }
        public List<Prod> ListProduct { get; set; }

        public string Action { get; set; }
    }
}