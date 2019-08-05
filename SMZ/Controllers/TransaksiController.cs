using SMZ.Models.Request;
using SMZ.Models.Response;
using SMZ.Core;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SMZ.Controllers
{
    public class TransaksiController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet, HttpPost]
        public TransaksiResponse LoadPage(string load, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                        List<Customer> ListCustomer = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                        List<SMZEntities.Vendor> ListVendor = ctx.Vendors.Where(x => x.Rowstatus == true && !"panitia".Contains(x.Name)).ToList();

                        List<Models.Response.Vendor> ListVendorWithStok = new List<Models.Response.Vendor>();
                        foreach (SMZEntities.Vendor item in ListVendor)
                        {
                            Models.Response.Vendor v = new Models.Response.Vendor();
                            v.ID = item.ID;
                            v.Name = item.Name;
                            v.StokKambing = ListProduct.Where(x => x.VendorID == item.ID && (x.Name.ToLower().Contains("kambing") || x.Name.ToLower().Contains("domba"))).Select(c => c.Stok).DefaultIfEmpty(0).Sum();
                            v.PartOfCow = ListProduct.Where(x => x.VendorID == item.ID && x.Name.ToLower().Contains("sapi")).Select(c => c.PartOfCow).DefaultIfEmpty(0).Sum();
                            v.StokSapi = ListProduct.Where(x => x.VendorID == item.ID && x.Name.ToLower().Contains("sapi")).Select(c => c.Stok).DefaultIfEmpty(0).Sum();
                            ListVendorWithStok.Add(v);
                        }

                        response.ListVendor = ListVendorWithStok;

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

        [HttpPost, HttpGet]
        public TransaksiResponse GetListCustomer(string getCustomer)
        {
            TransaksiResponse response = new TransaksiResponse();

            using (var ctx = new SMZEntities.SMZEntities())
            {
                List<Customer> ListCustomer = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                response.ListCustomer = ListCustomer.Select(z => new CustomerTrans() { ID = z.ID, Nama = z.Name }).ToList();
            }
            return response;
        }

        [HttpPost]
        public TransaksiResponse LoadNotaActive(string loadNota, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        Cust custom = new Cust();
                        NotaDetail nd = new NotaDetail();

                        int productVendorID = 0;
                        List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();

                        Panitia p = GetPanitiaProduct();
                        List<int> ListPanitiaID = new List<int>() { p.PotongKambingID, p.PotongSapiID, p.TitipKambingID, p.TitipSapiID, p.InfaqID };
                        Nota nota = ctx.Notas.Where(x => x.RowStatus == true && x.ID == request.NotaID).First();
                        List<NotaDetail> ListDetail = ctx.NotaDetails.Where(x => x.RowStatus == true && x.NotaID == nota.ID).ToList();
                        Customer customer = ctx.Customers.Where(x => x.Rowstatus == true && x.ID == nota.CustomerID).First();
                        //List<Family> listFamily = ctx.Families.Where(x => x.Rowstatus == true && x.CustomerID == customer.ID).ToList();

                        custom.ID = customer.ID;
                        custom.Address = customer.Address;
                        custom.Name = customer.Name;
                        custom.Telp = customer.Telp;
                        if (nota.Family != null)
                        {
                            List<string> listFamily = nota.Family.Remove(0, 1).Split(',').ToList();
                            custom.ListFamily = listFamily.Select(x => new Famz() { FamilyName = x }).ToList();
                        }
                        //custom.ListFamily = listFamily.Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).ToList();

                        nd = ListDetail.Where(x => x.ProductID == p.TitipKambingID).FirstOrDefault();
                        response.BiayaTitipKambing = (nd == null) ? 0 : nd.Price;

                        nd = ListDetail.Where(x => x.ProductID == p.TitipSapiID).FirstOrDefault();
                        response.BiayaTitipSapi = (nd == null) ? 0 : nd.Price;

                        nd = ListDetail.Where(x => x.ProductID == p.PotongKambingID).FirstOrDefault();
                        response.BPemotonganKambing = (nd == null) ? 0 : nd.Price;

                        nd = ListDetail.Where(x => x.ProductID == p.PotongSapiID).FirstOrDefault();
                        response.BPemotonganSapi = (nd == null) ? 0 : nd.Price;

                        nd = ListDetail.Where(x => x.ProductID == p.InfaqID).FirstOrDefault();
                        response.Infaq = (nd == null) ? 0 : nd.Price;

                        response.NoUrut = ListDetail.Where(x => x.RowStatus == true && !ListPanitiaID.Contains(x.ProductID)).First().ProductNo;
                        productVendorID = ListDetail.Where(x => x.RowStatus == true && !ListPanitiaID.Contains(x.ProductID)).First().ProductID;
                        Product product = ListProduct.Where(x => x.ID == productVendorID).FirstOrDefault();
                        response.VendorName = ctx.Vendors.Where(x => x.Rowstatus == true && x.ID == product.VendorID).First().Name;
                        response.ClassName = ctx.ProductClasses.Where(x => x.Rowstatus == true && x.ID == product.ClassID).First().Name;
                        response.VendorID = product.VendorID;
                        response.ProductID = product.ID;
                        response.ClassID = product.ClassID;

                        #region Old Code
                        List<SMZEntities.Vendor> ListVendor = ctx.Vendors.Where(x => x.Rowstatus == true).ToList();
                        response.ListProduct = ListProduct.Where(x => x.Rowstatus == true && x.VendorID == response.VendorID).Select(x => new Prod() { ID = x.ID, Name = x.Name, Price = x.Price }).ToList();

                        List<Models.Response.Vendor> ListVendorWithStok = new List<Models.Response.Vendor>();
                        foreach (SMZEntities.Vendor item in ListVendor)
                        {
                            Models.Response.Vendor v = new Models.Response.Vendor();
                            v.ID = item.ID;
                            v.Name = item.Name;
                            v.StokKambing = ListProduct.Where(x => x.VendorID == item.ID && (x.Name.Contains("kambing") || x.Name.Contains("domba"))).Sum(x => x.Stok);
                            v.StokSapi = ListProduct.Where(x => x.VendorID == item.ID && x.Name.Contains("sapi")).Sum(x => x.Stok);
                            ListVendorWithStok.Add(v);
                        }
                        List<SMZEntities.ProductClass> ListProd = ctx.ProductClasses.Where(x => x.Rowstatus == true).ToList();
                        List<Prod_Class> lp = ListProd.Select(x => new Prod_Class() { ID = x.ID, Name = x.Name, Description = x.Description, Price = x.Price }).ToList();
                        response.ListVendor = ListVendorWithStok;
                        response.ListProductClass = lp;
                        #endregion

                        User user = ctx.Users.Where(x => x.RowStatus == true && x.Email == nota.CreatedBy).FirstOrDefault();
                        response.CreatedBy = (user == null) ? "" : user.Name;

                        response.PartOfCow = ListDetail.Where(x => x.RowStatus == true && !ListPanitiaID.Contains(x.ProductID)).First().Total;
                        response.CareDays = nota.CareDays;
                        response.Price = ListDetail.Where(x => x.RowStatus == true && !ListPanitiaID.Contains(x.ProductID)).First().Price;
                        response.NotaCode = nota.NotaCode;
                        response.Customer = custom;
                        response.TransactionDate = DateTime.SpecifyKind(nota.TransactionDate, DateTimeKind.Utc);
                        response.Note = nota.Note;
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
                log.Error("TransaksiController.LoadNotaActive :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

        public TransaksiResponse LoadCustomer(string loadCustomer, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    Customer cust = ctx.Customers.Where(x => x.Rowstatus == true && x.ID == request.CustomerID).FirstOrDefault();
                    if (cust != null)
                    {
                        Cust c = new Cust();
                        List<Family> Listfamz = ctx.Families.Where(x => x.Rowstatus == true && x.CustomerID == cust.ID).ToList();
                        c.ID = cust.ID;
                        c.Name = cust.Name;
                        c.Address = cust.Address;
                        c.Telp = cust.Telp;
                        c.ListFamily = Listfamz.Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).ToList();
                        response.Customer = c;
                        response.IsSuccess = true;
                    }

                    response.Message = "Sukses load data.";
                }
            }
            catch (Exception ex)
            {
                log.Error("TransaksiController.LoadCustomer :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

        public TransaksiResponse LoadProductClass(string loadProductClassAndFee, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    List<SMZEntities.ProductClass> ListProd = ctx.ProductClasses.Where(x => x.Rowstatus == true).ToList();
                    List<Prod_Class> lp = ListProd.Select(x => new Prod_Class() { ID = x.ID, Name = x.Name, Description = x.Description, Price = x.Price }).ToList();
                    response.ListProductClass = lp;
                    response.BiayaTitipKambing = ctx.Products.Where(x => x.Rowstatus == true && x.Name.Contains("kambing") && x.VendorID == 1).First().Price;
                    response.BiayaTitipSapi = ctx.Products.Where(x => x.Rowstatus == true && x.Name.Contains("sapi") && x.VendorID == 1).First().Price;
                    response.BPemotonganKambing = ctx.Products.Where(x => x.Rowstatus == true && x.Name == "Biaya Pemotongan Kambing").First().Price;
                    response.BPemotonganSapi = ctx.Products.Where(x => x.Rowstatus == true && x.Name == "Biaya Pemotongan Sapi").First().Price;

                    response.IsSuccess = true;
                    response.Message = "Sukses load data.";
                }
            }
            catch (Exception ex)
            {
                log.Error("TransaksiController.LoadProduct :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

        public TransaksiResponse LoadProduct(string loadProduct, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    List<Product> ListProd = new List<Product>();
                    string hewan = (request.isSapi) ? "sapi" : "kambing";
                    if (request.isCustom)
                    {
                        ListProd = (from p in ctx.Products
                                    join pc in ctx.ProductClasses on p.ClassID equals pc.ID
                                    where p.Rowstatus == true && pc.Rowstatus == true &&
                                    p.VendorID == request.VendorID && pc.Name.ToLower().Contains(hewan)
                                    select p).ToList();
                    }
                    else
                    {
                        ListProd = ctx.Products.Where(x => x.Rowstatus == true && x.VendorID == request.VendorID && x.ClassID == request.ClassID).ToList();
                    }

                    List<Prod> lp = new List<Prod>();
                    foreach (Product item in ListProd)
                    {
                        Prod p = new Prod();
                        p.ID = item.ID;
                        p.Name = item.Name;
                        p.Price = item.Price;
                        lp.Add(p);
                    }
                    response.ListProduct = lp;
                    response.BiayaTitipKambing = ctx.Products.Where(x => x.Rowstatus == true && x.Name.Contains("kambing") && x.VendorID == 1).First().Price;
                    response.BiayaTitipSapi = ctx.Products.Where(x => x.Rowstatus == true && x.Name.Contains("sapi") && x.VendorID == 1).First().Price;
                    response.BPemotonganKambing = ctx.Products.Where(x => x.Rowstatus == true && x.Name == "Biaya Pemotongan Kambing").First().Price;
                    response.BPemotonganSapi = ctx.Products.Where(x => x.Rowstatus == true && x.Name == "Biaya Pemotongan Sapi").First().Price;
                    response.IsSuccess = true;
                    response.Message = "Sukses load data.";
                }
            }
            catch (Exception ex)
            {
                log.Error("TransaksiController.LoadProduct :" + ex.ToString());
                response.IsSuccess = false;
                response.Message = "Gagal load data. Error : " + ex.ToString();
                return response;
            }
            return response;
        }

        public string GenerateCode(int lastID)
        {
            string result = string.Empty;
            result = DateTime.Now.ToString("yyyymmddHHmm") + (lastID + 1).ToString().PadLeft(5, '0');
            return result;
        }

        public Panitia GetPanitiaProduct()
        {
            Panitia result = new Panitia();
            using (var ctx = new SMZEntities.SMZEntities())
            {
                List<Prod> Listpro = (from pro in ctx.Products
                                      join ven in ctx.Vendors on pro.VendorID equals ven.ID
                                      where ven.Name == "panitia"
                                      select new Prod()
                                      {
                                          ID = pro.ID,
                                          Name = pro.Name
                                      }).ToList();
                result.PotongKambingID = Listpro.Where(x => x.Name == "Biaya Pemotongan Kambing").First().ID;
                result.PotongSapiID = Listpro.Where(x => x.Name == "Biaya Pemotongan Sapi").First().ID;
                result.TitipKambingID = Listpro.Where(x => x.Name.ToLower().Contains("kambing")).FirstOrDefault().ID;
                result.TitipSapiID = Listpro.Where(x => x.Name.ToLower().Contains("sapi")).First().ID;
                result.InfaqID = Listpro.Where(x => x.Name == "Infaq").First().ID;
            }

            return result;
        }

        public TransaksiResponse SubmitTransaksi(string submit, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        Nota nota = new Nota();
                        ProductHistory ph = new ProductHistory();
                        NotaDetail notaDetail = new NotaDetail();
                        NotaDetail nd = new NotaDetail();
                        Product product = new Product();
                        if (ctx.Customers.Where(x => x.Rowstatus == true && x.Telp == request.Customer.Telp && x.Name == request.Customer.Name).Any())
                        {
                            #region Customer already exist
                            #region Insert in Product and Product history
                            product = ctx.Products.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.ProductID).First();
                            if (!product.Name.ToLower().Contains("kambing") && !product.Name.ToLower().Contains("domba") && request.Transaksi.NoUrut < 1)
                            {
                                product.PartOfCow = (product.PartOfCow == null) ? 0 + request.Transaksi.PartOfCow : product.PartOfCow + request.Transaksi.PartOfCow;
                                if (product.PartOfCow == 1)
                                {
                                    product.Stok = product.Stok - 1;
                                }
                            }
                            else
                            {
                                product.Stok = (product.Stok == null) ? 0 - 1 : product.Stok - 1;
                            }
                            if (product.Stok < 0)
                            {
                                Product p = ctx.Products.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.ProductID).First();
                                SMZEntities.Vendor v = ctx.Vendors.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.VendorID).First();
                                response.Message = "Maaf stok untuk " + p.Name + " dari " + v.Name + " telah habis. \r\n Mohon cek kembali transaksi anda.";
                                response.IsSuccess = false;
                                return response;
                            }
                            product.LastNumber = (product.LastNumber == null) ? 0 + 1 : product.LastNumber + 1;
                            product.ModifiedBy = username;
                            product.ModifiedOn = DateTime.Now;

                            ph.ProductID = product.ID;
                            ph.Name = product.Name;
                            ph.Price = product.Price;
                            ph.VendorID = product.VendorID;
                            ph.Product = product;
                            ph.Stok = product.Stok;
                            ph.LastNumber = product.LastNumber;
                            ph.CreatedBy = username;
                            ph.CreatedOn = DateTime.Now;
                            ph.Rowstatus = true;
                            ctx.ProductHistories.Add(ph);
                            #endregion

                            #region Insert table Nota
                            List<Nota> ListNota = ctx.Notas.Where(x => x.RowStatus == true).ToList();
                            int lastNotaID = (ListNota.Count == 0) ? 0 : ctx.Notas.Max(x => x.ID);

                            #region
                            //string famzID = string.Empty;

                            //nota.CustomerID = request.Transaksi.CustomerID;
                            //foreach (var item in request.Transaksi.FamilyID)
                            //{
                            //    famzID = famzID + "," + item.ToString();
                            //}
                            #endregion

                            string listFamz = string.Empty;

                            nota.CustomerID = request.Transaksi.CustomerID;
                            foreach (var item in request.Customer.ListFamily)
                            {
                                listFamz = listFamz + "," + item.FamilyName;
                            }
                            nota.Family = listFamz;
                            nota.TransactionDate = DateTime.Now;
                            nota.Note = request.Transaksi.Note;
                            nota.CareDays = request.Transaksi.CareDays;
                            nota.NotaCode = GenerateCode(lastNotaID);
                            nota.CreatedBy = username;
                            nota.CreatedOn = DateTime.Now;
                            nota.RowStatus = true;
                            ctx.Notas.Add(nota);
                            #endregion

                            #region Insert table Nota Detail

                            #region
                            //if (request.Transaksi.BiayaPemeliharaan > 0)
                            //{
                            //    if (product.Name.ToLower().Contains("sapi"))
                            //    {
                            //        nd.ProductID = PanitiaProd.TitipSapiID;
                            //    }
                            //    else
                            //    {
                            //        nd.ProductID = PanitiaProd.TitipKambingID;
                            //    }
                            //    nd.NotaID = nota.ID;
                            //    nd.Nota = nota;
                            //    nd.Price = request.Transaksi.BiayaPemeliharaan;
                            //    nd.Total = 1;
                            //    nd.CreatedBy = username;
                            //    nd.CreatedOn = DateTime.Now;
                            //    nd.RowStatus = true;
                            //    ctx.NotaDetails.Add(nd);
                            //}
                            #endregion

                            Panitia PanitiaProd = GetPanitiaProduct();
                            if (request.Transaksi.BiayaPemotonganKambing > 0)
                            {
                                NotaDetail ndPtong = new NotaDetail();
                                ndPtong.NotaID = nota.ID;
                                ndPtong.Nota = nota;
                                ndPtong.Price = request.Transaksi.BiayaPemotonganKambing;
                                ndPtong.Total = 1;
                                ndPtong.ProductID = ctx.Products.Where(x => x.VendorID == 1 && x.Rowstatus == true && x.Name == "Biaya Pemotongan Kambing").First().ID;
                                ndPtong.CreatedBy = username;
                                ndPtong.CreatedOn = DateTime.Now;
                                ndPtong.RowStatus = true;
                                ctx.NotaDetails.Add(ndPtong);
                            }

                            if (request.Transaksi.BiayaPemotonganSapi > 0)
                            {
                                NotaDetail ndPtong = new NotaDetail();
                                ndPtong.NotaID = nota.ID;
                                ndPtong.Nota = nota;
                                ndPtong.Price = request.Transaksi.BiayaPemotonganSapi;
                                ndPtong.Total = 1;
                                ndPtong.ProductID = ctx.Products.Where(x => x.VendorID == 1 && x.Rowstatus == true && x.Name == "Biaya Pemotongan Sapi").First().ID;
                                ndPtong.CreatedBy = username;
                                ndPtong.CreatedOn = DateTime.Now;
                                ndPtong.RowStatus = true;
                                ctx.NotaDetails.Add(ndPtong);
                            }

                            if (request.Transaksi.Infaq > 0)
                            {
                                NotaDetail ndInfaq = new NotaDetail();
                                ndInfaq.NotaID = nota.ID;
                                ndInfaq.Nota = nota;
                                ndInfaq.Price = request.Transaksi.Infaq;
                                ndInfaq.Total = 1;
                                ndInfaq.ProductID = PanitiaProd.InfaqID;
                                ndInfaq.CreatedBy = username;
                                ndInfaq.CreatedOn = DateTime.Now;
                                ndInfaq.RowStatus = true;
                                ctx.NotaDetails.Add(ndInfaq);

                            }

                            notaDetail.NotaID = nota.ID;
                            notaDetail.Nota = nota;
                            notaDetail.Price = request.Transaksi.Price;
                            notaDetail.Total = (product.Name.ToLower().Contains("sapi")) ? request.Transaksi.PartOfCow : 1;
                            notaDetail.ProductID = request.Transaksi.ProductID;
                            notaDetail.ProductNo = (request.Transaksi.NoUrut < 1) ? product.LastNumber : request.Transaksi.NoUrut;
                            notaDetail.CreatedBy = username;
                            notaDetail.CreatedOn = DateTime.Now;
                            notaDetail.RowStatus = true;
                            ctx.NotaDetails.Add(notaDetail);
                            #endregion
                            #endregion
                        }
                        else
                        {
                            #region New Customer
                            #region Save Customer and family
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
                                }
                            }
                            #endregion

                            #region Insert in Product and Product history
                            product = ctx.Products.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.ProductID).First();
                            product.Stok = (product.Stok == null) ? 0 - 1 : product.Stok - 1;
                            if (product.Stok < 0)
                            {
                                Product p = ctx.Products.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.ProductID).First();
                                SMZEntities.Vendor v = ctx.Vendors.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.VendorID).First();
                                response.Message = "Maaf stok untuk " + p.Name + " dari " + v.Name + " telah habis. \r\n Mohon cek kembali transaksi anda.";
                                response.IsSuccess = false;
                                return response;
                            }
                            product.LastNumber = (product.LastNumber == null) ? 0 + 1 : product.LastNumber + 1;
                            product.ModifiedBy = username;
                            product.ModifiedOn = DateTime.Now;

                            ph.ProductID = product.ID;
                            ph.Name = product.Name;
                            ph.Price = product.Price;
                            ph.VendorID = product.VendorID;
                            ph.Product = product;
                            ph.Stok = product.Stok;
                            ph.LastNumber = product.LastNumber;
                            ph.CreatedBy = username;
                            ph.CreatedOn = DateTime.Now;
                            ctx.ProductHistories.Add(ph);
                            #endregion

                            #region Insert table Nota
                            List<Nota> ListNota = ctx.Notas.Where(x => x.RowStatus == true).ToList();
                            int lastNotaID = (ListNota.Count == 0) ? 0 : ctx.Notas.Max(x => x.ID);
                            string famzID = string.Empty;
                            nota.CustomerID = c.ID;

                            //List<Family> listFamz = ctx.Families.Where(x => x.CustomerID == c.ID).ToList();
                            //foreach (var item in listFamz)
                            //{
                            //    famzID = famzID + "," + item.ToString();
                            //}
                            //nota.FamilyID = famzID;string listFamz = string.Empty;
                            string listFamz = string.Empty;
                            nota.CustomerID = request.Transaksi.CustomerID;
                            foreach (var item in request.Customer.ListFamily)
                            {
                                listFamz = listFamz + "," + item.FamilyName;
                            }
                            nota.Family = listFamz;
                            nota.TransactionDate = DateTime.Now;
                            nota.Note = request.Transaksi.Note;
                            nota.CareDays = request.Transaksi.CareDays;
                            nota.NotaCode = GenerateCode(lastNotaID);
                            nota.CreatedBy = username;
                            nota.CreatedOn = DateTime.Now;
                            nota.RowStatus = true;
                            ctx.Notas.Add(nota);
                            #endregion

                            #region Insert table Nota Detail

                            Panitia PanitiaProd = GetPanitiaProduct();
                            //if (request.Transaksi.BiayaPemeliharaan > 0)
                            //{

                            //    if (product.Name.ToLower().Contains("sapi"))
                            //    {
                            //        nd.ProductID = PanitiaProd.TitipSapiID;
                            //    }
                            //    else
                            //    {
                            //        nd.ProductID = PanitiaProd.TitipKambingID;
                            //    }
                            //    nd.NotaID = nota.ID;
                            //    nd.Nota = nota;
                            //    nd.Price = request.Transaksi.BiayaPemeliharaan;
                            //    nd.Total = 1;
                            //    nd.CreatedBy = username;
                            //    nd.CreatedOn = DateTime.Now;
                            //    nd.RowStatus = true;
                            //    ctx.NotaDetails.Add(nd);
                            //}

                            if (request.Transaksi.BiayaPemotonganKambing > 0)
                            {
                                NotaDetail ndPtong = new NotaDetail();
                                ndPtong.NotaID = nota.ID;
                                ndPtong.Nota = nota;
                                ndPtong.Price = request.Transaksi.BiayaPemotonganKambing;
                                ndPtong.Total = 1;
                                ndPtong.ProductID = ctx.Products.Where(x => x.VendorID == 1 && x.Rowstatus == true && x.Name == "Biaya Pemotongan Kambing").First().ID;
                                ndPtong.CreatedBy = username;
                                ndPtong.CreatedOn = DateTime.Now;
                                ndPtong.RowStatus = true;
                                ctx.NotaDetails.Add(ndPtong);
                            }

                            if (request.Transaksi.BiayaPemotonganSapi > 0)
                            {
                                NotaDetail ndPtong = new NotaDetail();
                                ndPtong.NotaID = nota.ID;
                                ndPtong.Nota = nota;
                                ndPtong.Price = request.Transaksi.BiayaPemotonganSapi;
                                ndPtong.Total = 1;
                                ndPtong.ProductID = ctx.Products.Where(x => x.VendorID == 1 && x.Rowstatus == true && x.Name == "Biaya Pemotongan Sapi").First().ID;
                                ndPtong.CreatedBy = username;
                                ndPtong.CreatedOn = DateTime.Now;
                                ndPtong.RowStatus = true;
                                ctx.NotaDetails.Add(ndPtong);
                            }

                            if (request.Transaksi.Infaq > 0)
                            {
                                NotaDetail ndInfaq = new NotaDetail();
                                ndInfaq.NotaID = nota.ID;
                                ndInfaq.Nota = nota;
                                ndInfaq.Price = request.Transaksi.Infaq;
                                ndInfaq.Total = 1;
                                ndInfaq.ProductID = PanitiaProd.InfaqID;
                                ndInfaq.CreatedBy = username;
                                ndInfaq.CreatedOn = DateTime.Now;
                                ndInfaq.RowStatus = true;
                                ctx.NotaDetails.Add(ndInfaq);
                            }

                            notaDetail.NotaID = nota.ID;
                            notaDetail.Nota = nota;
                            notaDetail.Price = request.Transaksi.Price;
                            notaDetail.Total = 1;
                            notaDetail.ProductID = request.Transaksi.ProductID;
                            notaDetail.ProductNo = product.LastNumber;
                            notaDetail.CreatedBy = username;
                            notaDetail.CreatedOn = DateTime.Now;
                            notaDetail.RowStatus = true;
                            ctx.NotaDetails.Add(notaDetail);
                            #endregion
                            #endregion
                        }
                        ctx.SaveChanges();
                        response.NotaID = nota.ID;
                        response.LastNumber = product.LastNumber.Value;
                        response.IsSuccess = true;
                        response.Message = "Transaksi berhasil.";
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
                return response;
            }
            return response;
        }

        public TransaksiResponse CancelTransaksi(string SubmitCancellation, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                string username = Security.ValidateToken(request.Token);
                if (username != null)
                {
                    response.Token = Security.GenerateToken(username);
                    using (var ctx = new SMZEntities.SMZEntities())
                    {
                        Panitia panitia = GetPanitiaProduct();
                        List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                        Nota nota = ctx.Notas.Where(x => x.RowStatus == true && x.ID == request.ID).First();
                        List<NotaDetail> ListNotaDetail = ctx.NotaDetails.Where(x => x.RowStatus == true && x.NotaID == nota.ID).ToList();
                        foreach (NotaDetail item in ListNotaDetail)
                        {
                            if (item.ProductID != panitia.InfaqID && item.ProductID != panitia.PotongKambingID && item.ProductID != panitia.PotongSapiID
                                && item.ProductID != panitia.TitipKambingID && item.ProductID != panitia.TitipSapiID)
                            {
                                Product p = ListProduct.Where(x => x.ID == item.ProductID).First();
                                if (p.Name.ToLower().Contains("sapi") && item.Total < 1)
                                {
                                    // Sapi Pecahan
                                    p.PartOfCow = p.PartOfCow - item.Total;
                                }
                                else
                                {
                                    // Sapi Utuh / Kambing
                                    p.Stok = p.Stok.Value + Convert.ToInt32(item.Total);
                                }
                            }

                            item.RowStatus = false;
                            item.ModifiedBy = username;
                            item.ModifiedOn = DateTime.Now;
                        }

                        nota.CancellationNote = request.Note;
                        nota.RowStatus = false;
                        nota.ModifiedBy = username;
                        nota.ModifiedOn = DateTime.Now;

                        ctx.SaveChanges();

                        response.IsSuccess = true;
                        response.Message = "Transaksi berhasil.";
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
                return response;
            }
            return response;
        }

        // SubmitCancellation
    }
}
