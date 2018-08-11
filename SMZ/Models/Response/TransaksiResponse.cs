using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class TransaksiResponse : ResponseBase
    {
        public List<Prod> ListProduct { get; set; }
        public List<Vendor> ListVendor { get; set; }
        public List<CustomerTrans> ListCustomer { get; set; }
        public Cust Customer { get; set; }
        public decimal BPemotongan { get; set; }
        public decimal BPelihara { get; set; }
        public decimal Infaq { get; set; }
        public int LastNumber { get; set; }
        public string NotaCode{ get; set; }

        public int? NoHewan { get; set; }
        public DateTime TransactionDate { get; set; }
        public int ProductID { get; set; }
        public int VendorID { get; set; }
        public string Note { get; set; }
    }

    public class Vendor
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
}