using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.PRESENTATION.Models
{
    public class Response
    {
        public string Token { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
    }
}