using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class TransaksiResponse : ResponseBase
    {
        public List<Prod> ListProduct { get; set; }
        public List<Prod_Class> ListProductClass { get; set; }
        public List<Vendor> ListVendor { get; set; }
        public List<CustomerTrans> ListCustomer { get; set; }
        public Cust Customer { get; set; }
        public decimal? BPemotonganKambing { get; set; }
        public decimal? BPemotonganSapi { get; set; }
        public decimal? BiayaTitipKambing { get; set; }
        public decimal? BiayaTitipSapi { get; set; }
        public decimal Infaq { get; set; }
        public int LastNumber { get; set; }
        public string NotaCode{ get; set; }
        public int NotaID{ get; set; }
        public double PartOfCow { get; set; }

        public decimal Price { get; set; }
        public int? CareDays { get; set; }
        public string CreatedBy { get; set; }
        public string VendorName { get; set; }
        public int? NoUrut { get; set; }
        public DateTime TransactionDate { get; set; }
        public int ProductID { get; set; }
        public string ClassName { get; set; }
        public int? ClassID { get; set; }
        public int VendorID { get; set; }
        public string Note { get; set; }
    }
    public class Prod_Class {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
    }
    public class Vendor
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int? StokKambing { get; set; }
        public int? StokSapi { get; set; }
        public double? PartOfCow { get; set; }
    }
}