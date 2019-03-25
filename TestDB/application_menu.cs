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
    
    public partial class application_menu
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public application_menu()
        {
            this.role_access_menu = new HashSet<role_access_menu>();
        }
    
        public string id { get; set; }
        public string created_by { get; set; }
        public Nullable<System.DateTime> created_on { get; set; }
        public string modified_by { get; set; }
        public Nullable<System.DateTime> modified_on { get; set; }
        public string approved_by { get; set; }
        public Nullable<System.DateTime> approved_on { get; set; }
        public Nullable<bool> is_active { get; set; }
        public Nullable<bool> is_locked { get; set; }
        public Nullable<bool> is_default { get; set; }
        public string owner_id { get; set; }
        public string organization_id { get; set; }
        public string menu_name { get; set; }
        public string application_menu_group_id { get; set; }
        public string application_menu_category_id { get; set; }
        public string deleted_by { get; set; }
        public Nullable<System.DateTime> deleted_on { get; set; }
        public Nullable<bool> is_deleted { get; set; }
        public string parent_menu_id { get; set; }
        public string action_url { get; set; }
    
        public virtual organization organization { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<role_access_menu> role_access_menu { get; set; }
    }
}
