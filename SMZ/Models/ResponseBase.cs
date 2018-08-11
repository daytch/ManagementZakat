using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models
{
    public class ResponseBase
    {
        public string Token { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
    }
}