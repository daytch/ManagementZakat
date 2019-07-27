using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class ProductResponse : ResponseBase
    {
        public List<Products> data { get; set; }

        public List<Vendor> ListVendor { get; set; }

        public List<Prod_Class> ListClass { get; set; }
        public int ID { get; set; }
        public string Name { get; set; }
        public int VendorID { get; set; }
        public int? ClassID { get; set; }
        public int? Stok { get; set; }
        public decimal? Price { get; set; }
        public string Image { get; set; }
    }

    public class Products
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string VendorName { get; set; }
        public string @Class { get; set; }
        public string Images { get; set; }
        public int Price { get; set; }
        public int? Stok { get; set; }
        public string Code { get; set; }
        public double? PartOfCow { get; set; }
    }

}