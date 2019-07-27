using Newtonsoft.Json;
using SMZ.Core;
using SMZ.Models.Request;
using SMZ.Models.Response;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace SMZ.Controllers
{
    public class ProductController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public ProductResponse GetAll(string GetAll, [FromUri] ProductRequest request)
        {
            ProductResponse response = new ProductResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<SMZEntities.Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                        List<Products> ListProducts = (from p in ctx.Products
                                                       join v in ctx.Vendors on p.VendorID equals v.ID
                                                       join c in ctx.ProductClasses on p.ClassID equals c.ID
                                                       where p.Rowstatus == true && v.Rowstatus == true && c.Rowstatus == true
                                                       select new Products()
                                                       {
                                                           ID = p.ID,
                                                           Name = p.Name,
                                                           VendorName = v.Name,
                                                           Class = c.Name,
                                                           Images = p.Image,
                                                           Price = c.Price,
                                                           Code = p.ProductCode,
                                                           Stok = (p.Stok == null) ? 0 : p.Stok,
                                                           PartOfCow = p.PartOfCow
                                                       }).ToList();
                        response.data = ListProducts;

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
                log.Error("ProductController.GetAll :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public ProductResponse Get(string GetProduct, [FromBody] ProductRequest request)
        {
            ProductResponse response = new ProductResponse();
            string username = Security.ValidateToken(request.Token);
            if (username != null)
            {
                response.Token = Security.GenerateToken(username);
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    Product product = ctx.Products.Where(x => x.Rowstatus == true && x.ID == request.ID).FirstOrDefault();
                    if (product != null)
                    {
                        response.ID = product.ID;
                        response.Name = product.Name;
                        response.VendorID = product.VendorID;
                        response.ClassID = product.ClassID;
                        response.Image = product.Image;
                        response.Price = (product.Price == null) ? 0 : product.Price;
                        response.Stok = (product.Stok == null) ? 0 : product.Stok;
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
        public ProductResponse Delete(string Delete, [FromBody] ProductRequest request)
        {
            ProductResponse response = new ProductResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        SMZEntities.Product vend = ctx.Products.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                        vend.Rowstatus = false;
                        vend.ModifiedBy = username;
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
                log.Error("ProductController.Delete :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpGet, HttpPost]
        public ProductResponse LoadPage(string load, [FromBody] ProductRequest request)
        {
            ProductResponse response = new ProductResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<SMZEntities.Vendor> ListVendor = ctx.Vendors.Where(x => x.Rowstatus == true && !"panitia".Contains(x.Name)).ToList();
                        response.ListVendor = ListVendor.Select(x => new Models.Response.Vendor() { ID = x.ID, Name = x.Name }).ToList();

                        List<SMZEntities.ProductClass> ListProd = ctx.ProductClasses.Where(x => x.Rowstatus == true).ToList();
                        List<Prod_Class> lp = ListProd.Select(x => new Prod_Class() { ID = x.ID, Name = x.Name, Description = x.Description, Price = x.Price }).ToList();
                        response.ListClass = lp;

                        response.IsSuccess = true;
                        response.Message = "Sukses load data.";
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
            catch (Exception ex)
            {
                log.Error("TransaksiController.LoadPage :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

        [HttpPost]
        public ProductResponse Save(string Save, [FromBody] ProductRequest request)
        {
            ProductResponse response = new ProductResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        Product prod = new Product();
                        SMZEntities.Vendor vendor = ctx.Vendors.Where(x => x.Rowstatus == true && x.ID == request.VendorID).FirstOrDefault();
                        if (vendor == null)
                        {
                            response.Message = "Vendor does not exist in our DB.";
                            response.IsSuccess = false;
                            return response;
                        }

                        if (request.Action.ToLower() == "add")
                        {
                            prod.Vendor = vendor;
                            prod.VendorID = vendor.ID;
                            prod.Name = request.Name;
                            prod.Price = request.Price;
                            prod.ClassID = request.ClassID;
                            prod.ProductCode = request.ProductCode;
                            prod.Image = request.Image;
                            prod.LastNumber = request.LastNumber;
                            prod.Stok = request.Stok;

                            prod.CreatedBy = username;
                            prod.CreatedOn = DateTime.Now;
                            prod.Rowstatus = true;
                            ctx.Products.Add(prod);

                            ProductHistory ph = new ProductHistory();
                            ph.ProductID = prod.ID;
                            ph.LastNumber = prod.LastNumber;
                            ph.Name = prod.Name;
                            ph.Price = prod.Price;
                            ph.Product = prod;
                            ph.Rowstatus = true;
                            ph.Stok = prod.Stok;
                            ph.VendorID = prod.VendorID;
                            ph.CreatedBy = username;
                            ph.CreatedOn = DateTime.Now;
                            ctx.ProductHistories.Add(ph);

                            response.Message = "Your data has been save.";
                            response.IsSuccess = true;

                        }
                        else
                        {
                            prod = ctx.Products.Where(x => x.ID == request.ID && x.Rowstatus == true).FirstOrDefault();
                            if (prod == null)
                            {
                                response.Message = "Product does not exist in our DB.";
                                response.IsSuccess = false;
                                return response;
                            }

                            prod.Vendor = vendor;
                            prod.VendorID = vendor.ID;
                            prod.Name = request.Name;
                            prod.Price = request.Price;
                            prod.ClassID = request.ClassID;
                            prod.ProductCode = request.ProductCode;
                            prod.Image = request.Image;
                            prod.LastNumber = request.LastNumber;

                            prod.ModifiedBy = username;
                            prod.ModifiedOn = DateTime.Now;
                            prod.Rowstatus = true;

                            if (request.Stok.HasValue && prod.Stok != request.Stok)
                            {
                                prod.Stok = request.Stok;

                                // Insert to table productHistory
                                ProductHistory ph = new ProductHistory();
                                ph.ProductID = prod.ID;
                                ph.LastNumber = prod.LastNumber;
                                ph.Name = prod.Name;
                                ph.Price = prod.Price;
                                ph.Product = prod;
                                ph.Rowstatus = true;
                                ph.Stok = prod.Stok;
                                ph.VendorID = prod.VendorID;
                                ph.CreatedBy = username;
                                ph.CreatedOn = DateTime.Now;
                                ctx.ProductHistories.Add(ph);
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
                log.Error("ProductController.Save :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public HttpResponseMessage Post()
        {

            HttpResponseMessage result = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            string fileName = string.Empty;
            try
            {
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    foreach (string file in httpRequest.Files)
                    {
                        var postedFile = httpRequest.Files[file];
                        fileName = string.Format(DateTime.Now.ToString("yyyy_MM_dd_HH_mm_ss_") + postedFile.FileName);
                        string str_uploadpath = HttpContext.Current.Server.MapPath("~/FileUploads/");
                        var filePath = Path.Combine(str_uploadpath, fileName);
                        postedFile.SaveAs(filePath);
                        docfiles.Add(filePath);
                    }
                    var responseObj = new { FileName = fileName, message = "SUccess Upload FIle", IsSuccess = true };

                    result = new HttpResponseMessage
                    {
                        Content = new StringContent(JsonConvert.SerializeObject(responseObj),
                                                                System.Text.Encoding.UTF8, "application/json")
                    };
                }
                else
                {
                    result = Request.CreateResponse(HttpStatusCode.BadRequest);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }
    }
}
