//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SMZEntities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Nota
    {
        public Nota()
        {
            this.NotaDetails = new HashSet<NotaDetail>();
        }
    
        public int ID { get; set; }
        public string NotaCode { get; set; }
        public string FamilyID { get; set; }
        public int CustomerID { get; set; }
        public System.DateTime TransactionDate { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedOn { get; set; }
        public bool RowStatus { get; set; }
    
        public virtual Customer Customer { get; set; }
        public virtual ICollection<NotaDetail> NotaDetails { get; set; }
    }
}
