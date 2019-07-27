using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class ProductClassResponse : ResponseBase
    {
        public List<ProductsClass> data { get; set; }

        public List<Vendor> ListVendor { get; set; }

        public List<Prod_Class> ListClass { get; set; }
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
    }
    public class ProductsClass
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
    }

}