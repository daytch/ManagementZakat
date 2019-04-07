using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class KalkulatorRequest:RequestBase
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public string Action { get; set; }
    }
}