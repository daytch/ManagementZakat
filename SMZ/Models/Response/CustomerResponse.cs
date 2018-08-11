using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SMZ.Models.Response
{
    public class CustomerResponse : ResponseBase
    {
        public List<Cust> data { get; set; }

        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telp { get; set; }
        public List<Famz> ListFamily { get; set; }
        public List<CustomerTrans> ListCustomer { get; set; }
    }

    public class CustomerTrans
    {
        public int ID { get; set; }
        public string Nama { get; set; }
    }

    public class Cust
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telp { get; set; }
        public List<Famz> ListFamily { get; set; }
    }

    public class Famz
    {
        public int ID { get; set; }
        public string FamilyName { get; set; }
    }
}