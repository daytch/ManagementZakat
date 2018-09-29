using SMZEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class UserResponse : ResponseBase
    {
        public List<User> data { get; set; }
    }
}