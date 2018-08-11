using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class ReportResponse : ResponseBase
    {
        public List<Report> data { get; set; }
    }    

    public class Report
    {
        public int NotaID { get; set; }
        public string NotaCode { get; set; }
        public DateTime TransactionDate { get; set; }
        public string CustomerName { get; set; }
        public List<ReportDetail> ListDetail { get; set; }
        public decimal Total { get; set; }
    }

    public class ReportDetail
    {
        public int NotaDetailID { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}