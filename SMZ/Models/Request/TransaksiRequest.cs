using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class TransaksiRequest : RequestBase
    {
        public int ID { get; set; }
        public string Note { get; set; }
        public Trx Transaksi { get; set; }
        public List<CustomerTrans> ListCustomer { get; set; }
        public int CustomerID { get; set; }
        public int VendorID { get; set; }
        public int ClassID { get; set; }
        public bool isCustom { get; set; }
        public bool isSapi { get; set; }
        public int NotaID { get; set; }
        public Cust Customer { get; set; }

        public string Action { get; set; }
    }

    public class Trx
    {
        public int CustomerID { get; set; }
        public List<int> FamilyID { get; set; }
        public int VendorID { get; set; }
        public int ProductID { get; set; }
        public int Price { get; set; }
        public int Infaq { get; set; }
        public int BiayaPemotonganKambing { get; set; }
        public int BiayaPemotonganSapi { get; set; }
        //public int BiayaPemeliharaan { get; set; }
        public string Note { get; set; }
        public int? CareDays { get; set; }
        public double PartOfCow { get; set; }
        public int NoUrut { get; set; }
    }

    public class Panitia
    {
        public int PotongKambingID { get; set; }
        public int PotongSapiID { get; set; }
        public int TitipKambingID { get; set; }
        public int TitipSapiID { get; set; }
        public int InfaqID { get; set; }
    }

}