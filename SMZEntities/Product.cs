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
    
    public partial class Product
    {
        public Product()
        {
            this.NotaDetails = new HashSet<NotaDetail>();
            this.ProductHistories = new HashSet<ProductHistory>();
        }
    
        public int ID { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int VendorID { get; set; }
        public Nullable<int> Stok { get; set; }
        public Nullable<int> LastNumber { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public bool Rowstatus { get; set; }
    
        public ICollection<NotaDetail> NotaDetails { get; set; }
        public Vendor Vendor { get; set; }
        public ICollection<ProductHistory> ProductHistories { get; set; }
    }
}
