//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TestDB
{
    using System;
    using System.Collections.Generic;
    
    public partial class compensation
    {
        public string id { get; set; }
        public long employee_basic_info_id { get; set; }
        public System.DateTime date_compensation { get; set; }
        public Nullable<System.DateTime> end_compensation { get; set; }
        public string compensation_id { get; set; }
        public int value { get; set; }
        public string type { get; set; }
        public string created_by { get; set; }
        public Nullable<System.DateTime> created_on { get; set; }
        public string modified_by { get; set; }
        public Nullable<System.DateTime> modified_on { get; set; }
        public string approved_by { get; set; }
        public Nullable<System.DateTime> approved_on { get; set; }
        public Nullable<bool> is_active { get; set; }
        public Nullable<bool> is_locked { get; set; }
        public Nullable<bool> is_default { get; set; }
        public Nullable<bool> is_deleted { get; set; }
        public string owner_id { get; set; }
        public string deleted_by { get; set; }
        public Nullable<System.DateTime> deleted_on { get; set; }
    }
}
