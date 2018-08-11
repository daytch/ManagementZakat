using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class TransaksiRequest : RequestBase
    {
        public Trx Transaksi { get; set; }
        public List<CustomerTrans> ListCustomer { get; set; }
        public int CustomerID { get; set; }
        public int VendorID { get; set; }
        public int NotaID { get; set; }

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
        public int BiayaPemotongan { get; set; }
        public int BiayaPemeliharaan { get; set; }
        public string Note { get; set; }
    }

    public class Panitia
    {
        public int PotongID { get; set; }
        public int PeliharaID { get; set; }
        public int InfaqID { get; set; }
    }

}