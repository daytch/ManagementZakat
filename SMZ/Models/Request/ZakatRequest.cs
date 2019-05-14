using SMZ.Models.Response;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class ZakatRequest:RequestBase
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public Cust Customer { get; set; }
        public NotaZakat Nota { get; set; }
        public List<NotaZakatDetail> NotaDetail { get; set; }

        public string Action { get; set; }
    }
    public class TransaksiZakat
    {
        public int TypeOfZakatID { get; set; }
        public int Jumlah { get; set; }
        public int Nominal { get; set; }
    }
}