
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
    
public partial class NotaDetail
{

    public int ID { get; set; }

    public int NotaID { get; set; }

    public int ProductID { get; set; }

    public double Total { get; set; }

    public decimal Price { get; set; }

    public Nullable<int> ProductNo { get; set; }

    public string CreatedBy { get; set; }

    public System.DateTime CreatedOn { get; set; }

    public string ModifiedBy { get; set; }

    public Nullable<System.DateTime> ModifiedOn { get; set; }

    public bool RowStatus { get; set; }



    public Product Product { get; set; }

    public Nota Nota { get; set; }

}

}
