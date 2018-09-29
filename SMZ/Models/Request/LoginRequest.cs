using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class LoginRequest : RequestBase
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}