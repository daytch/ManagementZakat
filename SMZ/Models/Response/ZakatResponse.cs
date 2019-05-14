using SMZEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class ZakatResponse : ResponseBase
    {
        public string NotaCode { get; set; }

        public List<TypeOfZakat> ListType { get; set; }

        public int ID { get; set; }
        public string Name { get; set; }
        public List<ReportZakat> data { get; set; }
    }

    public class ReportZakat
    {
        public int NotaID { get; set; }
        public string NotaCode { get; set; }
        public DateTime TransactionDate { get; set; }
        public string CustomerName { get; set; }
        public string Telp { get; set; }
        public string Address { get; set; }
        public List<ReportZakatDetail> ListDetail { get; set; }
        public List<Famz> ListFamily { get; set; }
        public decimal Total { get; set; }
        public string CreatedBy { get; set; }
    }

    public class ReportZakatDetail
    {
        public int NotaDetailID { get; set; }
        public string Name { get; set; }
        public decimal Nominal { get; set; }
        public decimal Total { get; set; }
        public decimal Jumlah { get; set; }
    }

    public class Zakat {
        public int ID { get; set; }
        public string Name { get; set; }
    }

}