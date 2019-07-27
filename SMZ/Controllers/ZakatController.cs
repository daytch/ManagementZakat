using OfficeOpenXml;
using OfficeOpenXml.Style;
using SMZ.Core;
using SMZ.Models.Request;
using SMZ.Models.Response;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Transactions;
using System.Web;
using System.Web.Http;


namespace SMZ.Controllers
{
    public class ZakatController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        //public ZakatResponse GetMasterZakat(string GetMasterZakat, [FromUri] ZakatRequest request)
        //{
        //    ZakatResponse response = new ZakatResponse();
        //    try
        //    {
        //        string username = Security.ValidateToken(request.Token);
        //        if (username != null)
        //        {
        //            response.Token = Security.GenerateToken(username);
        //            using (var ctx = new SMZEntities.SMZEntities())
        //            {
        //                List<TypeOfZakat> ListTypeZakat = ctx.TypeOfZakats.Where(x => x.Rowstatus == true).ToList();
        //                List<Zakat> listZakat = ListTypeZakat.Select(x => new Zakat() { ID = x.ID, Name = x.Name }).ToList();
        //                response.data = listZakat;

        //                response.IsSuccess = true;

        //            }
        //            return response;
        //        }
        //        else
        //        {
        //            response.IsSuccess = false;
        //            response.Token = "";
        //            response.Message = "Sorry your session is expired, please re-login to access this page";
        //            return response;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        log.Error("ZakatController.GetAll :" + ex.ToString());
        //        response.Message = ex.ToString();
        //        response.IsSuccess = false;
        //        return response;
        //    }
        //}

        [HttpPost]
        public ZakatResponse GetTypeOfZakat(string getTypeOfZakat, [FromBody] ZakatRequest request)
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
                        response.ListType = ctx.TypeOfZakats.Where(x => x.Rowstatus == true).ToList();
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
                log.Error("ZakatController.getTypeOfZakat :" + ex.ToString());
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

        public string GenerateCode(int lastID)
        {
            string result = string.Empty;
            result = DateTime.Now.ToString("yyyymmddHHmm") + (lastID + 1).ToString().PadLeft(5, '0');
            return result;
        }

        [HttpPost]
        public ZakatResponse SubmitTransaksi(string submit, [FromBody] ZakatRequest request)
        {
            ZakatResponse response = new ZakatResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);

                    using (TransactionScope scope = new TransactionScope())
                    {
                        using (var ctx = new SMZEntities.SMZEntities())
                        {
                            NotaZakat nota = new NotaZakat();
                            string newFamilyID = string.Empty;
                            if (request.Customer.ID > 0)
                            {
                                #region Add / Edit Family
                                Customer c = ctx.Customers.Where(x => x.ID == request.Customer.ID && x.Rowstatus == true).First();
                                c.Address = request.Customer.Address;
                                c.Name = request.Customer.Name;
                                c.Telp = request.Customer.Telp;
                                c.ModifiedBy = username;
                                c.ModifiedOn = DateTime.Now;
                                if (request.Customer.ListFamily != null)
                                {
                                    foreach (Famz item in request.Customer.ListFamily)
                                    {
                                        Family famz = ctx.Families.Where(x => x.ID == item.ID && x.Rowstatus == true).FirstOrDefault();
                                        if (famz == null)
                                        {
                                            famz = new Family();
                                            famz.Customer = c;
                                            famz.CustomerID = c.ID;
                                            famz.Name = item.FamilyName;
                                            famz.CreatedBy = username;
                                            famz.CreatedOn = DateTime.Now;
                                            famz.Rowstatus = true;

                                            ctx.Families.Add(famz);
                                            ctx.SaveChanges();
                                            newFamilyID = newFamilyID + "," + famz.ID;
                                        }
                                        else
                                        {
                                            famz.Customer = c;
                                            famz.CustomerID = c.ID;
                                            famz.Name = item.FamilyName;
                                            famz.ModifiedBy = username;
                                            famz.ModifiedOn = DateTime.Now;
                                            famz.Rowstatus = true;
                                        }
                                    }
                                }
                                #endregion
                                #region Insert table Nota
                                List<NotaZakat> ListNota = ctx.NotaZakats.Where(x => x.RowStatus == true).ToList();
                                int lastNotaID = (ListNota.Count == 0) ? 0 : ctx.NotaZakats.Max(x => x.ID);

                                //string famzID = string.Empty;
                                //List<Family> listFamz = ctx.Families.Where(x => x.CustomerID == c.ID).ToList();
                                //foreach (Family item in listFamz)
                                //{
                                //    string id = (item.ID == 0) ? item.ToString() : item.ID.ToString();
                                //    famzID = famzID + "," + id;
                                //}
                                nota.FamilyID = newFamilyID;
                                nota.CustomerID = c.ID;
                                nota.TransactionDate = DateTime.Now;
                                nota.Code = GenerateCode(lastNotaID);
                                nota.CreatedBy = username;
                                nota.CreatedOn = DateTime.Now;
                                nota.RowStatus = true;
                                ctx.NotaZakats.Add(nota);
                                #endregion
                                foreach (NotaZakatDetail item in request.NotaDetail)
                                {
                                    NotaZakatDetail notadetail = new NotaZakatDetail();

                                    notadetail.NotaZakatID = nota.ID;
                                    notadetail.Jumlah = item.Jumlah;
                                    notadetail.TypeOfZakatID = item.TypeOfZakatID;
                                    notadetail.Nominal = item.Nominal;
                                    notadetail.Total = item.Total;
                                    notadetail.CreatedBy = username;
                                    notadetail.CreatedOn = DateTime.Now;
                                    notadetail.RowStatus = true;
                                    ctx.NotaZakatDetails.Add(notadetail);
                                }
                            }
                            else
                            {
                                #region Save Customer and Family
                                Customer c = new Customer();
                                c.Name = request.Customer.Name;
                                c.Address = request.Customer.Address;
                                c.Telp = request.Customer.Telp;
                                c.Rowstatus = true;
                                c.CreatedBy = username;
                                c.CreatedOn = DateTime.Now;
                                ctx.Customers.Add(c);

                                if (request.Customer.ListFamily != null)
                                {
                                    foreach (Famz item in request.Customer.ListFamily)
                                    {
                                        Family famz = new Family();
                                        famz.Customer = c;
                                        famz.CustomerID = c.ID;
                                        famz.Name = item.FamilyName;
                                        famz.CreatedBy = username;
                                        famz.CreatedOn = DateTime.Now;
                                        famz.Rowstatus = true;

                                        ctx.Families.Add(famz);
                                        ctx.SaveChanges();
                                        newFamilyID = newFamilyID + "," + famz.ID;
                                    }
                                }
                                #endregion

                                #region Insert table Nota
                                List<NotaZakat> ListNota = ctx.NotaZakats.Where(x => x.RowStatus == true).ToList();
                                int lastNotaID = (ListNota.Count == 0) ? 0 : ctx.NotaZakats.Max(x => x.ID);
                                nota.CustomerID = c.ID;

                                //string famzID = string.Empty;
                                //List<Family> listFamz = ctx.Families.Where(x => x.CustomerID == c.ID).ToList();
                                //foreach (Family item in listFamz)
                                //{
                                //    string id = (item.ID == 0) ? item.ToString() : item.ID.ToString();
                                //    famzID = famzID + "," + id;
                                //}
                                nota.FamilyID = newFamilyID;
                                nota.CustomerID = c.ID;
                                nota.TransactionDate = DateTime.Now;
                                nota.Code = GenerateCode(lastNotaID);
                                nota.CreatedBy = username;
                                nota.CreatedOn = DateTime.Now;
                                nota.RowStatus = true;
                                ctx.NotaZakats.Add(nota);
                                #endregion

                                foreach (NotaZakatDetail item in request.NotaDetail)
                                {
                                    NotaZakatDetail notadetail = new NotaZakatDetail();

                                    notadetail.NotaZakatID = nota.ID;
                                    notadetail.Jumlah = item.Jumlah;
                                    notadetail.TypeOfZakatID = item.TypeOfZakatID;
                                    notadetail.Nominal = item.Nominal;
                                    notadetail.Total = item.Total;
                                    notadetail.CreatedBy = username;
                                    notadetail.CreatedOn = DateTime.Now;
                                    notadetail.RowStatus = true;
                                    ctx.NotaZakatDetails.Add(notadetail);
                                }
                            }

                            ctx.SaveChanges();
                            User uLogin = ctx.Users.Where(x => x.RowStatus == true && x.Email == username).FirstOrDefault();
                            response.Name = (uLogin == null) ? "" : uLogin.Name;
                            response.NotaCode = nota.Code;
                            response.IsSuccess = true;
                            response.Message = "Transaksi berhasil.";
                        }
                        scope.Complete();
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
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                log.Error("ZakatController.submit :" + ex.ToString());
                return response;
            }
            return response;
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
                log.Error("ZakatController.delete :" + ex.ToString());
                return response;
            }
        }

        [HttpPost]
        public ZakatResponse LoadPageZakat(string loadReport, [FromBody] ReportRequest request)
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
                        List<ReportZakat> ListReport = new List<ReportZakat>();
                        List<NotaZakat> ListNota = new List<NotaZakat>();
                        if (request.ID == 0)
                        {
                            ListNota = ctx.NotaZakats.Where(x => x.RowStatus == true).OrderByDescending(x => x.ID).ToList();
                        }
                        else
                        {
                            ListNota = ctx.NotaZakats.Where(x => x.RowStatus == true && x.ID == request.ID).OrderByDescending(x => x.ID).ToList();

                        }
                        List<Customer> ListCustomer = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                        List<NotaZakatDetail> ListNotaDetail = ctx.NotaZakatDetails.Where(x => x.RowStatus == true).ToList();
                        List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                        foreach (NotaZakat item in ListNota)
                        {
                            User user = ctx.Users.Where(x => x.RowStatus == true && x.Email == item.CreatedBy).FirstOrDefault();
                            List<ReportZakatDetail> ListRDetail = new List<ReportZakatDetail>();
                            ReportZakat r = new ReportZakat();
                            List<NotaZakatDetail> ListND = new List<NotaZakatDetail>();
                            ListND = ListNotaDetail.Where(x => x.NotaZakatID == item.ID && x.RowStatus == true).ToList();
                            r.CustomerName = ListCustomer.Where(x => x.ID == item.CustomerID).First().Name;
                            r.NotaCode = item.Code;
                            r.NotaID = item.ID;
                            r.Address = ListCustomer.Where(x => x.ID == item.CustomerID).First().Address;
                            r.CreatedBy = (user == null) ? "" : user.Name;
                            r.Telp = ListCustomer.Where(x => x.ID == item.CustomerID).First().Telp;
                            r.TransactionDate = DateTime.SpecifyKind(item.TransactionDate, DateTimeKind.Utc);

                            List<int> ListZakatBerasID = ctx.TypeOfZakats.Where(x => x.Name.Contains("beras") && x.Rowstatus == true).Select(x => x.ID).ToList();

                            r.Total = ListNotaDetail.Where(x => x.NotaZakatID == item.ID && !ListZakatBerasID.Contains(x.TypeOfZakatID)).Sum(x => x.Total);
                            foreach (var i in ListND)
                            {
                                ReportZakatDetail rDetail = new ReportZakatDetail();
                                rDetail.Jumlah = i.Jumlah;
                                rDetail.Nominal = i.Nominal;
                                rDetail.Total = i.Total;
                                rDetail.Name = ctx.TypeOfZakats.Where(x => x.Rowstatus == true && x.ID == i.TypeOfZakatID).First().Name;
                                rDetail.NotaDetailID = i.ID;
                                ListRDetail.Add(rDetail);
                            }
                            List<Family> listFamily = ctx.Families.Where(x => x.CustomerID == item.CustomerID && x.Rowstatus == true).ToList();
                            List<Famz> ListFamz = new List<Famz>();
                            if (!string.IsNullOrEmpty(item.FamilyID))
                            {
                                string[] arrFamID = item.FamilyID.Split(',');
                                foreach (var strID in arrFamID)
                                {
                                    if (strID != "")
                                    {
                                        int id = Convert.ToInt32(strID);
                                        Famz f = listFamily.Where(x => x.ID == id && x.Rowstatus == true).Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).FirstOrDefault();
                                        if (f != null)
                                        {
                                            ListFamz.Add(f);
                                        }
                                    }
                                }
                            }
                            r.ListFamily = ListFamz;
                            r.ListDetail = ListRDetail;
                            ListReport.Add(r);

                            response.Name = (user == null) ? "" : user.Name;
                        }
                        response.data = ListReport;
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
                log.Error("ZakatController.LoadPage :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

        [HttpPost]
        public HttpResponseMessage DownloadExcel(string downloadExcel, [FromBody]ReportRequest request)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            DataTable dt = new DataTable();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    using (ExcelPackage pck = new ExcelPackage())
                    {
                        using (SMZEntities.SMZEntities ctx = new SMZEntities.SMZEntities())
                        {
                            ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Sheet1");

                            ws.Cells["A1"].Value = "No.Nota";
                            ws.Cells["B1"].Value = "Nama";
                            ws.Cells["C1"].Value = "Tanggal";
                            ws.Cells["D1"].Value = "Detail";
                            ws.Cells["E1"].Value = "Total";

                            ws.Column(1).Width = 20;
                            ws.Column(2).Width = 30;
                            ws.Column(3).Width = 15;
                            ws.Column(4).Width = 80;
                            ws.Column(5).Width = 40;
                            ws.Cells["A1:E1"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            ws.Cells["A1:E1"].Style.Fill.BackgroundColor.SetColor(Color.Aqua);
                            ws.Cells["A1:E1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws.Cells["A1:E1"].Style.Font.Bold = true;
                            ws.Cells["A1:E1"].Style.Font.Size = 14;
                            ws.Cells.Style.WrapText = true;
                            ws.Cells.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                            dt = GetDataTransaksiZakat(ctx);

                            if (dt.Rows.Count > 0)
                            {
                                ws.Cells["A2"].LoadFromDataTable(dt, false);
                            }

                            HttpContext.Current.Response.ClearContent();
                            HttpContext.Current.Response.ClearHeaders();
                            HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                            HttpContext.Current.Response.AddHeader("content-disposition", "attachment; filename=" + "ReportZakat.xlsx");
                            HttpContext.Current.Response.BinaryWrite(pck.GetAsByteArray());

                            response.Headers.Add("cache-control", "private");
                        }
                    }
                }
                else
                {
                    response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    return response;
                }
            }
            catch (Exception ex)
            {
                log.Error("ZakatController.DownloadExcel :" + ex.ToString());
                response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
            return response;
        }

        private DataTable GetDataTransaksiZakat(SMZEntities.SMZEntities ctx)
        {
            DataTable dt = new DataTable();
            try
            {
                #region " Get Report Zakat "
                List<ReportZakat> ListReport = new List<ReportZakat>();
                List<NotaZakat> ListNota = new List<NotaZakat>();
                ListNota = ctx.NotaZakats.Where(x => x.RowStatus == true).OrderByDescending(x => x.ID).ToList();
                List<Customer> ListCustomer = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                List<NotaZakatDetail> ListNotaDetail = ctx.NotaZakatDetails.Where(x => x.RowStatus == true).ToList();
                List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                foreach (NotaZakat item in ListNota)
                {
                    List<ReportZakatDetail> ListRDetail = new List<ReportZakatDetail>();
                    ReportZakat r = new ReportZakat();
                    List<NotaZakatDetail> ListND = new List<NotaZakatDetail>();
                    ListND = ListNotaDetail.Where(x => x.NotaZakatID == item.ID && x.RowStatus == true).ToList();
                    r.CustomerName = ListCustomer.Where(x => x.ID == item.CustomerID).First().Name;
                    r.NotaCode = item.Code;
                    r.NotaID = item.ID;
                    r.Address = ListCustomer.Where(x => x.ID == item.CustomerID).First().Address;
                    r.Telp = ListCustomer.Where(x => x.ID == item.CustomerID).First().Telp;
                    r.TransactionDate = DateTime.SpecifyKind(item.TransactionDate, DateTimeKind.Utc);
                    r.Total = ListNotaDetail.Where(x => x.NotaZakatID == item.ID).Sum(x => x.Total);
                    foreach (var i in ListND)
                    {
                        ReportZakatDetail rDetail = new ReportZakatDetail();
                        rDetail.Jumlah = i.Jumlah;
                        rDetail.Nominal = i.Nominal;
                        rDetail.Total = i.Total;
                        rDetail.Name = ctx.TypeOfZakats.Where(x => x.Rowstatus == true && x.ID == i.TypeOfZakatID).First().Name;
                        rDetail.NotaDetailID = i.ID;
                        ListRDetail.Add(rDetail);
                    }
                    List<Family> listFamily = ctx.Families.Where(x => x.CustomerID == item.CustomerID && x.Rowstatus == true).ToList();
                    List<Famz> ListFamz = new List<Famz>();
                    if (!string.IsNullOrEmpty(item.FamilyID))
                    {
                        string[] arrFamID = item.FamilyID.Split(',');
                        foreach (var strID in arrFamID)
                        {
                            if (strID != "")
                            {
                                int id = Convert.ToInt32(strID);
                                Famz f = listFamily.Where(x => x.ID == id && x.Rowstatus == true).Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).FirstOrDefault();
                                if (f != null)
                                {
                                    ListFamz.Add(f);
                                }
                            }
                        }
                    }
                    r.ListFamily = ListFamz;
                    r.ListDetail = ListRDetail;
                    ListReport.Add(r);
                }
                #endregion
                dt.Columns.Add("NoNota");
                dt.Columns.Add("Nama");
                dt.Columns.Add("Tanggal");
                dt.Columns.Add("Detail");
                dt.Columns.Add("Total");

                foreach (ReportZakat item in ListReport)
                {
                    DataRow row = dt.NewRow();
                    string detail = string.Empty;
                    string total = string.Empty;
                    int intTotal = 0;
                    if (item.ListDetail.Count > 0)
                    {
                        foreach (ReportZakatDetail i in item.ListDetail)
                        {
                            intTotal += (i.Name.ToLower().Contains("beras")) ? 0 : Convert.ToInt32(i.Total);
                            string nom = (i.Name.ToLower().Contains("beras")) ? i.Nominal.ToString() : Currency.ToRupiah(Convert.ToInt32(i.Nominal));
                            total = (i.Name.ToLower().Contains("beras")) ? i.Total.ToString() : Currency.ToRupiah(Convert.ToInt32(i.Total));
                            detail += " " + i.Name + " = " + nom + " @ untuk " + i.Jumlah + " jiwa, Total = " + total + "\n";
                        }
                    }
                    row["NoNota"] = item.NotaCode;
                    row["Nama"] = item.CustomerName;
                    row["Tanggal"] = item.TransactionDate.ToString("dd/MM/yyyy");
                    row["Detail"] = detail;// item.ListDetail.ToString();
                    row["Total"] = Currency.ToRupiah(intTotal);
                    dt.Rows.Add(row);
                }
            }
            catch (Exception ex)
            {
                log.Error("ZakatController.GetDataTransaksiZakat :" + ex.ToString());
            }
            return dt;
        }
    }
}
