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
    
    public partial class job_interview
    {
        public string id { get; set; }
        public string job_posting_requisition_id { get; set; }
        public Nullable<System.DateTime> interview_date { get; set; }
        public Nullable<System.TimeSpan> interview_time { get; set; }
        public string place_of_interview { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string job_interview_description { get; set; }
        public string interviewer { get; set; }
        public string from_email { get; set; }
        public string to_email { get; set; }
        public string notes { get; set; }
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
