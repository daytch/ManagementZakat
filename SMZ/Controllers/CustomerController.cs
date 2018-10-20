using SMZ.Core;
using SMZ.Models.Request;
using SMZ.Models.Response;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SMZ.Controllers
{
    public class CustomerController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public CustomerResponse GetAll(string GetAll,[FromUri] CustomerRequest request)
        {
            CustomerResponse response = new CustomerResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<Cust> listFamzCust = new List<Cust>();
                        List<Customer> ListCust = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                        foreach (Customer item in ListCust)
                        {
                            Cust cf = new Cust();
                            List<Family> fam = ctx.Families.Where(x => x.Rowstatus == true && x.CustomerID == item.ID).ToList();
                            cf.ID = item.ID;
                            cf.Name = item.Name;
                            cf.Address = item.Address;
                            cf.Telp = item.Telp;
                            cf.ListFamily = fam.Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).ToList();
                            listFamzCust.Add(cf);
                        }
                        response.data = listFamzCust;

                        response.IsSuccess = true;
                    }
                    return response;
                }
                else
                {
                    response.IsSuccess = false;
                    response.Token = "";
                    response.Message = "Sorry your session is expired, please re-login to access this page";
                    return response;
                }
            }
            catch (Exception ex)
            {
                log.Error("CustomerController.GetAll :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }
        #region
        public CustomerResponse GetCustomerForAutocomplete(string CustomerAutocomplete)
        {
            CustomerResponse response = new CustomerResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    List<CustomerTrans> listFamzCust = new List<CustomerTrans>();
                    List<Customer> ListCust = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                    foreach (Customer item in ListCust)
                    {
                        CustomerTrans ct = new CustomerTrans();
                        ct.ID = item.ID;
                        ct.Nama = item.Name;
                        listFamzCust.Add(ct);
                    }
                    response.ListCustomer = listFamzCust;

                    response.IsSuccess = true;
                }
                return response;
            }
            catch (Exception ex)
            {
                log.Error("CustomerController.GetCustomerForAutocomplete :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }
        #endregion

        [HttpPost]
        public CustomerResponse Get(string GetCust, [FromBody] CustomerRequest customer)
        {
            CustomerResponse response = new CustomerResponse();
            using (var ctx = new SMZEntities.SMZEntities())
            {
                string username = Security.ValidateToken(customer.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    Customer result = ctx.Customers.Where(x => x.Rowstatus == true && x.ID == customer.ID).FirstOrDefault();
                    List<Family> listFamz = ctx.Families.Where(x => x.Rowstatus == true && x.CustomerID == result.ID).ToList();
                    if (result != null)
                    {
                        response.ID = result.ID;
                        response.Name = result.Name;
                        response.Address = result.Address;
                        response.Telp = result.Telp;
                        response.ListFamily = listFamz.Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).ToList();
                        response.IsSuccess = true;
                    }
                    else
                    {
                        response.Message = "Customer does not exist in our database.";
                        response.IsSuccess = false;
                        return response;
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.Token = "";
                    response.Message = "Sorry your session is expired, please re-login to access this page";
                    return response;
                }
            }
            return response;
        }

        [HttpPost]
        public CustomerResponse Save(string Save, [FromBody] CustomerRequest request)
        {
            CustomerResponse response = new CustomerResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        if (request.Action.ToLower() == "add")
                        {
                            Customer cust = new Customer();
                            cust.Name = request.Name;
                            cust.Address = request.Address;
                            cust.Telp = request.Telp;
                            cust.Rowstatus = true;
                            cust.CreatedBy = username;
                            cust.CreatedOn = DateTime.Now;
                            ctx.Customers.Add(cust);

                            foreach (Famz item in request.ListFamily)
                            {
                                Family famz = new Family();
                                famz.Customer = cust;
                                famz.CustomerID = cust.ID;
                                famz.Name = item.FamilyName;
                                famz.CreatedBy = username;
                                famz.CreatedOn = DateTime.Now;
                                famz.Rowstatus = true;
                                ctx.Families.Add(famz);
                            }

                            response.Message = "Your data has been save.";
                            response.IsSuccess = true;
                        }
                        else
                        {
                            Customer cust = ctx.Customers.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                            cust.Name = request.Name;
                            cust.Address = request.Address;
                            cust.Telp = request.Telp;
                            cust.ModifiedBy = username;
                            cust.ModifiedOn = DateTime.Now;

                            foreach (Famz item in request.ListFamily)
                            {
                                if (item.ID > 0)
                                {
                                    Family famz = ctx.Families.Where(x => x.Rowstatus == true && x.ID == item.ID).First();
                                    if (string.IsNullOrEmpty(item.FamilyName))
                                    {
                                        famz.Rowstatus = false;
                                        famz.ModifiedBy = username;
                                        famz.ModifiedOn = DateTime.Now;
                                    }
                                    else
                                    {
                                        famz.Name = item.FamilyName;
                                        famz.ModifiedBy = username;
                                        famz.ModifiedOn = DateTime.Now;
                                    }
                                }
                                else
                                {
                                    Family Famz = new Family();
                                    Famz.Name = item.FamilyName;
                                    Famz.CustomerID = cust.ID;
                                    Famz.CreatedBy = username;
                                    Famz.CreatedOn = DateTime.Now;
                                    Famz.Rowstatus = true;
                                    ctx.Families.Add(Famz);
                                }
                            }

                            response.Message = "Your data has been save.";
                            response.IsSuccess = true;
                        }
                        ctx.SaveChanges();
                    }
                    return response;
                }
                else
                {
                    response.IsSuccess = false;
                    response.Token = "";
                    response.Message = "Sorry your session is expired, please re-login to access this page";
                    return response;
                }
            }
            catch (Exception ex)
            {
                log.Error("CustomerController.Save" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public CustomerResponse Delete(string Delete, [FromBody] CustomerRequest request)
        {
            CustomerResponse response = new CustomerResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        Customer cust = ctx.Customers.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                        cust.Rowstatus = false;
                        cust.ModifiedBy = username;
                        cust.ModifiedOn = DateTime.Now;

                        response.Message = "Your data has been deleted.";
                        response.IsSuccess = true;

                        ctx.SaveChanges();
                    }
                    return response;
                }
                else
                {
                    response.IsSuccess = false;
                    response.Token = "";
                    response.Message = "Sorry your session is expired, please re-login to access this page";
                    return response;
                }
            }
            catch (Exception ex)
            {
                log.Error("CustomerController.Delete" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }
    }
}
