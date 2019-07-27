using SMZ.Core;
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
    public class ReportController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet,HttpPost]
        public ReportResponse LoadPage(string load, [FromUri] ReportRequest request)
        {
            ReportResponse response = new ReportResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<Report> ListReport = new List<Report>();
                        List<Nota> ListNota = ctx.Notas.Where(x => x.RowStatus == true).ToList();
                        List<Customer> ListCustomer = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                        List<NotaDetail> ListNotaDetail = ctx.NotaDetails.Where(x => x.RowStatus == true).ToList();
                        List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                        foreach (Nota item in ListNota)
                        {
                            List<ReportDetail> ListRDetail = new List<ReportDetail>();
                            Report r = new Report();
                            List<NotaDetail> ListND = new List<NotaDetail>();
                            ListND = ListNotaDetail.Where(x => x.NotaID == item.ID && x.RowStatus == true).ToList();
                            r.CustomerName = ListCustomer.Where(x => x.ID == item.CustomerID).First().Name;
                            r.NotaCode = item.NotaCode;
                            r.NotaID = item.ID;
                            r.TransactionDate = DateTime.SpecifyKind(item.TransactionDate, DateTimeKind.Utc);
                            r.Total = ListNotaDetail.Where(x => x.NotaID == item.ID).Sum(x => x.Price);
                            foreach (var i in ListND)
                            {
                                ReportDetail rDetail = new ReportDetail();
                                rDetail.Name = ListProduct.Where(x => x.ID == i.ProductID && x.Rowstatus == true).First().Name;
                                rDetail.Price = i.Price;
                                rDetail.NotaDetailID = i.ID;
                                ListRDetail.Add(rDetail);
                            }
                            r.ListDetail = ListRDetail;
                            ListReport.Add(r);
                        }
                        response.data = ListReport.OrderByDescending(x=>x.TransactionDate).ToList();
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
                log.Error("ReportController.LoadPage :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

    }
}
