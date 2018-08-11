using SMZ.Models.Request;
using SMZ.Models.Response;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SMZ.Controllers
{
    public class FamilyController : ApiController
    {
        public FamilyResponse GetAll(string GetAll)
        {
            FamilyResponse response = new FamilyResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    List<CustomerFamily> listFamzCust = new List<CustomerFamily>();
                    List<Customer> ListCust = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                    foreach (Customer item in ListCust)
                    {
                        CustomerFamily cf = new CustomerFamily();
                        List<Family> fam = ctx.Families.Where(x => x.Rowstatus == true && x.CustomerID == item.ID).ToList();
                        cf.Name = item.Name;
                        cf.ListFamily = fam.Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).ToList();
                        listFamzCust.Add(cf);
                    }
                    response.data = listFamzCust;
                    response.IsSuccess = true;
                }
                return response;

            }
            catch (Exception ex)
            {
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public FamilyResponse Get(string GetCust, [FromBody] FamilyRequest customer)
        {
            FamilyResponse response = new FamilyResponse();
            using (var ctx = new SMZEntities.SMZEntities())
            {
                Customer result = ctx.Customers.Where(x => x.Rowstatus == true && x.ID == customer.ID).FirstOrDefault();
                if (result != null)
                {
                    response.ID = result.ID;
                    response.Name = result.Name;
                    response.IsSuccess = true;
                }
                else
                {
                    response.Message = "Customer does not exist in our database.";
                    response.IsSuccess = false;
                    return response;
                }
            }
            return response;
        }

        [HttpPost]
        public FamilyResponse Save(string Save, [FromBody] FamilyRequest request)
        {
            FamilyResponse response = new FamilyResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    if (request.Action.ToLower() == "add")
                    {
                        Customer cust = new Customer();
                        cust.Name = request.Name;
                        cust.Address = request.Address;
                        cust.Telp = request.Telp;
                        cust.Rowstatus = true;
                        cust.CreatedBy = "admin";
                        cust.CreatedOn = DateTime.Now;
                        ctx.Customers.Add(cust);

                        response.Message = "Your data has been save.";
                        response.IsSuccess = true;
                    }
                    else
                    {
                        Customer cust = ctx.Customers.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                        cust.Name = request.Name;
                        cust.Address = request.Address;
                        cust.Telp = request.Telp;
                        cust.ModifiedBy = "admin";
                        cust.ModifiedOn = DateTime.Now;

                        response.Message = "Your data has been save.";
                        response.IsSuccess = true;
                    }
                    ctx.SaveChanges();
                }
                return response;
            }
            catch (Exception ex)
            {
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public FamilyResponse Delete(string Delete, [FromBody] FamilyRequest request)
        {
            FamilyResponse response = new FamilyResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    Customer cust = ctx.Customers.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                    cust.Rowstatus = false;
                    cust.ModifiedBy = "admin";
                    cust.ModifiedOn = DateTime.Now;

                    response.Message = "Your data has been deleted.";
                    response.IsSuccess = true;

                    ctx.SaveChanges();
                }
                return response;
            }
            catch (Exception ex)
            {
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }
    }
}
