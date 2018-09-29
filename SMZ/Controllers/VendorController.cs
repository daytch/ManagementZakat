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
    public class VendorController : ApiController
    {
        public VendorResponse GetAll(string GetAll,[FromUri] VendorRequest request)
        {
            VendorResponse response = new VendorResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<Vendors> listProduct = new List<Vendors>();
                        List<SMZEntities.Vendor> ListCust = ctx.Vendors.Where(x => x.Rowstatus == true).ToList();
                        foreach (SMZEntities.Vendor item in ListCust)
                        {
                            Vendors cf = new Vendors();
                            List<Product> ven = ctx.Products.Where(x => x.Rowstatus == true && x.VendorID == item.ID).ToList();
                            cf.ID = item.ID;
                            cf.Name = item.Name;
                            cf.Address = item.Address;
                            cf.Telp = item.Telp.ToString();
                            cf.ListProduct = ven.Select(x => new Prod() { ID = x.ID, Name = x.Name, Price = x.Price }).ToList();
                            listProduct.Add(cf);
                        }
                        response.data = listProduct;

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
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public VendorResponse Get(string GetCust, [FromBody] VendorRequest request)
        {
            VendorResponse response = new VendorResponse();
            string username = Security.ValidateToken(request.Token);
            if (username != null)
            {
                response.Token = Security.GenerateToken(username);
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    SMZEntities.Vendor result = ctx.Vendors.Where(x => x.Rowstatus == true && x.ID == request.ID).FirstOrDefault();
                    List<Product> listProduct = ctx.Products.Where(x => x.Rowstatus == true && x.VendorID == result.ID).ToList();
                    if (result != null)
                    {
                        response.ID = result.ID;
                        response.Name = result.Name;
                        response.Address = result.Address;
                        response.Telp = result.Telp.ToString();
                        response.ListProduct = listProduct.Select(x => new Prod() { ID = x.ID, Name = x.Name, Price = x.Price }).ToList();
                        response.IsSuccess = true;
                    }
                    else
                    {
                        response.Message = "Vendor does not exist in our database.";
                        response.IsSuccess = false;
                        return response;
                    }
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

        [HttpPost]
        public VendorResponse Save(string Save, [FromBody] VendorRequest request)
        {
            VendorResponse response = new VendorResponse();
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
                            SMZEntities.Vendor vendor = new SMZEntities.Vendor();
                            vendor.Name = request.Name;
                            vendor.Address = request.Address;
                            vendor.Telp = Convert.ToInt32(request.Telp);
                            vendor.Rowstatus = true;
                            vendor.CreatedBy = "admin";
                            vendor.CreatedOn = DateTime.Now;
                            ctx.Vendors.Add(vendor);

                            foreach (Prod item in request.ListProduct)
                            {
                                Product prod = new Product();
                                prod.Vendor = vendor;
                                prod.VendorID = vendor.ID;
                                prod.Name = item.Name;
                                prod.Price = item.Price;
                                prod.CreatedBy = "admin";
                                prod.CreatedOn = DateTime.Now;
                                prod.Rowstatus = true;
                                ctx.Products.Add(prod);
                            }

                            response.Message = "Your data has been save.";
                            response.IsSuccess = true;
                        }
                        else
                        {
                            SMZEntities.Vendor vendor = ctx.Vendors.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                            vendor.Name = request.Name;
                            vendor.Address = request.Address;
                            vendor.Telp = Convert.ToInt32(request.Telp);
                            vendor.ModifiedBy = "admin";
                            vendor.ModifiedOn = DateTime.Now;

                            foreach (Prod item in request.ListProduct)
                            {
                                if (item.ID > 0)
                                {
                                    Product prods = ctx.Products.Where(x => x.Rowstatus == true && x.ID == item.ID).First();
                                    if (string.IsNullOrEmpty(item.Name))
                                    {
                                        prods.Rowstatus = false;
                                        prods.ModifiedBy = "admin";
                                        prods.ModifiedOn = DateTime.Now;
                                    }
                                    else
                                    {
                                        prods.Price = item.Price;
                                        prods.Name = item.Name;
                                        prods.ModifiedBy = "admin";
                                        prods.ModifiedOn = DateTime.Now;
                                    }
                                }
                                else
                                {
                                    Product Prods = new Product();
                                    Prods.Name = item.Name;
                                    Prods.VendorID = vendor.ID;
                                    Prods.Price = item.Price;
                                    Prods.CreatedBy = "admin";
                                    Prods.CreatedOn = DateTime.Now;
                                    Prods.Rowstatus = true;
                                    ctx.Products.Add(Prods);
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
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public VendorResponse Delete(string Delete, [FromBody] VendorRequest request)
        {
            VendorResponse response = new VendorResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        SMZEntities.Vendor vend = ctx.Vendors.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                        vend.Rowstatus = false;
                        vend.ModifiedBy = "admin";
                        vend.ModifiedOn = DateTime.Now;

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
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

    }
}
