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
    public class ZakatController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public ZakatResponse GetMasterZakat(string GetMasterZakat, [FromUri] ZakatRequest request)
        {
            ZakatResponse response = new ZakatResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<TypeOfZakat> ListTypeZakat = ctx.TypeOfZakats.Where(x => x.Rowstatus == true).ToList();
                        List<Zakat> listZakat = ListTypeZakat.Select(x => new Zakat() { ID = x.ID, Name = x.Name }).ToList();
                        response.data = listZakat;

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
                log.Error("ZakatController.GetAll :" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public ZakatResponse Get(string GetZakat, [FromBody] ZakatRequest Zakat)
        {
            ZakatResponse response = new ZakatResponse();
            using (var ctx = new SMZEntities.SMZEntities())
            {
                string username = Security.ValidateToken(Zakat.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    TypeOfZakat result = ctx.TypeOfZakats.Where(x => x.Rowstatus == true && x.ID == Zakat.ID).FirstOrDefault();
                    if (result != null)
                    {
                        response.ID = result.ID;
                        response.Name = result.Name;
                        response.IsSuccess = true;
                    }
                    else
                    {
                        response.Message = "Zakat does not exist in our database.";
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
        public ZakatResponse Save(string Save, [FromBody] ZakatRequest request)
        {
            ZakatResponse response = new ZakatResponse();
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
                            TypeOfZakat z = new TypeOfZakat();
                            z.Name = request.Name;
                            z.CreatedBy = username;
                            z.CreatedOn = DateTime.Now;
                            z.Rowstatus = true;
                            ctx.TypeOfZakats.Add(z);
                            
                            response.Message = "Your data has been save.";
                            response.IsSuccess = true;
                        }
                        else
                        {
                            TypeOfZakat cust = ctx.TypeOfZakats.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
                            cust.Name = request.Name;
                            cust.ModifiedBy = username;
                            cust.ModifiedOn = DateTime.Now;

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
                log.Error("ZakatController.Save" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }

        [HttpPost]
        public ZakatResponse Delete(string Delete, [FromBody] ZakatRequest request)
        {
            ZakatResponse response = new ZakatResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        TypeOfZakat cust = ctx.TypeOfZakats.Where(x => x.ID == request.ID && x.Rowstatus == true).First();
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
                log.Error("ZakatController.Delete" + ex.ToString());
                response.Message = ex.ToString();
                response.IsSuccess = false;
                return response;
            }
        }
    }
}
