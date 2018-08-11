using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class ReportRequest : RequestBase
    {

        public string Action { get; set; }
    }
}