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
    public class ProductClassController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public ProductClassResponse GetAll(string GetAll, [FromUri] ProductClassRequest request)
        {
            ProductClassResponse response = new ProductClassResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<SMZEntities.ProductClass> ListProductClass = ctx.ProductClasses.Where(x => x.Rowstatus == true).ToList();
                        List<ProductsClass> ListProductClasses = ListProductClass.Select(x => new Models.Response.ProductsClass() { ID = x.ID, Name = x.Name, Description = x.Description, Price = x.Price }).ToList();
                        response.data = ListProductClasses;

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
                log.Error("ProductClassController.GetAll :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public ProductClassResponse Delete(string Delete, [FromBody] ProductClassRequest request)
        {
            ProductClassResponse response = new ProductClassResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        SMZEntities.ProductClass vend = ctx.ProductClasses.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
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
                log.Error("ProductClassController.Delete :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpGet, HttpPost]
        public ProductClassResponse LoadPage(string load, [FromBody] ProductClassRequest request)
        {
            ProductClassResponse response = new ProductClassResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        SMZEntities.ProductClass clas = ctx.ProductClasses.Where(x => x.Rowstatus == true && x.ID == request.ID).FirstOrDefault();
                        response.ID = clas.ID;
                        response.Description = clas.Description;
                        response.Price = clas.Price;
                        response.Name = clas.Name;

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
        public ProductClassResponse Save(string Save, [FromBody] ProductClassRequest request)
        {
            ProductClassResponse response = new ProductClassResponse();
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
                            SMZEntities.ProductClass clas = new SMZEntities.ProductClass();
                            clas.Name = request.Name;
                            clas.Price = request.Price;
                            clas.Description = request.Description;
                            clas.Rowstatus = true;
                            clas.CreatedBy = username;
                            clas.CreatedOn = DateTime.Now;
                            ctx.ProductClasses.Add(clas);
                            
                            response.Message = "Your data has been save.";
                            response.IsSuccess = true;
                        }
                        else
                        {
                            SMZEntities.ProductClass clas = ctx.ProductClasses.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                            clas.Name = request.Name;
                            clas.Price = request.Price;
                            clas.Description = request.Description;
                            clas.ModifiedBy = username;
                            clas.ModifiedOn = DateTime.Now;
                            
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
                log.Error("ProductClassController.Save :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }
    }
}
