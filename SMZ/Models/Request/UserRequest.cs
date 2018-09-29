using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Request
{
    public class UserRequest : RequestBase
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}