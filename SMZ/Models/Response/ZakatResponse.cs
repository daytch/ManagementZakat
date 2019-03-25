using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class ZakatResponse : ResponseBase
    {
        public List<Zakat> data { get; set; }

        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class Zakat
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
}