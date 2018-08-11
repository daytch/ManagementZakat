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
    public class TransaksiController : ApiController
    {
        [HttpGet, HttpPost]
        public TransaksiResponse LoadPage(string load, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    List<Customer> ListCustomer = ctx.Customers.Where(x => x.Rowstatus == true).ToList();
                    List<SMZEntities.Vendor> ListVendor = ctx.Vendors.Where(x => x.Rowstatus == true && !"panitia".Contains(x.Name)).ToList();
                    response.ListCustomer = ListCustomer.Select(z => new CustomerTrans() { ID = z.ID, Nama = z.Name }).ToList();
                    response.ListVendor = ListVendor.Select(x => new Models.Response.Vendor() { ID = x.ID, Name = x.Name }).ToList();
                    response.IsSuccess = true;
                    response.Message = "Sukses load data.";
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

        [HttpPost]
        public TransaksiResponse LoadNotaActive(string loadNota, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    Cust custom = new Cust();
                    NotaDetail nd = new NotaDetail();

                    int productVendorID = 0;
                    List<Product> ListProduct = ctx.Products.Where(x => x.Rowstatus == true && x.VendorID == 1).ToList();
                    List<Product> ListProductPanitia = ctx.Products.Where(x => x.Rowstatus == true).ToList();
                    int IDPotong = ListProduct.Where(x => x.Name == "Biaya Pemotongan").First().ID;
                    int IDPelihara = ListProduct.Where(x => x.Name == "Biaya Pemeliharaan").First().ID;
                    int IDInfaq = ListProduct.Where(x => x.Name == "Infaq").First().ID;
                    List<int> ListPanitiaID = new List<int>() { IDPotong, IDPelihara, IDInfaq };
                    Nota nota = ctx.Notas.Where(x => x.RowStatus == true && x.ID == request.NotaID).First();
                    List<NotaDetail> ListDetail = ctx.NotaDetails.Where(x => x.RowStatus == true && x.NotaID == nota.ID).ToList();
                    Customer customer = ctx.Customers.Where(x => x.Rowstatus == true && x.ID == nota.CustomerID).First();
                    List<Family> listFamily = ctx.Families.Where(x => x.Rowstatus == true && x.CustomerID == customer.ID).ToList();

                    custom.ID = customer.ID;
                    custom.Address = customer.Address;
                    custom.Name = customer.Name;
                    custom.Telp = customer.Telp;
                    custom.ListFamily = listFamily.Select(x => new Famz() { ID = x.ID, FamilyName = x.Name }).ToList();

                    nd = ListDetail.Where(x => x.ProductID == IDPelihara).FirstOrDefault();
                    response.BPelihara = (nd == null) ? 0 : nd.Price;

                    nd = ListDetail.Where(x => x.ProductID == IDPotong).FirstOrDefault();
                    response.BPemotongan = (nd == null) ? 0 : nd.Price;

                    nd = ListDetail.Where(x => x.ProductID == IDInfaq).FirstOrDefault();
                    response.BPelihara = (nd == null) ? 0 : nd.Price;

                    response.NoHewan = ListDetail.Where(x => x.RowStatus == true && !ListPanitiaID.Contains(x.ProductID)).First().ProductNo;
                    productVendorID = ListDetail.Where(x => x.RowStatus == true && !ListPanitiaID.Contains(x.ProductID)).First().ProductID;
                    response.VendorID = ListProductPanitia.Where(x => x.Rowstatus == true && x.ID == productVendorID).First().VendorID;
                    response.ProductID = ListProductPanitia.Where(x => x.ID == productVendorID).FirstOrDefault().ID;

                    response.ListVendor = ctx.Vendors.Where(x => x.Rowstatus == true).Select(x => new Models.Response.Vendor() { ID = x.ID, Name = x.Name }).ToList();
                    response.ListProduct = ListProductPanitia.Where(x => x.Rowstatus == true && x.VendorID == response.VendorID).Select(x => new Prod() { ID = x.ID, Name = x.Name, Price = x.Price }).ToList();

                    response.NotaCode = nota.NotaCode;
                    response.Customer = custom;
                    response.TransactionDate = DateTime.SpecifyKind(nota.TransactionDate, DateTimeKind.Utc);
                    response.Note = nota.Note;
                    response.IsSuccess = true;
                    response.Message = "Sukses load data.";
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
                    List<Product> ListProd = ctx.Products.Where(x => x.Rowstatus == true && x.VendorID == request.VendorID).ToList();
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
                    response.BPelihara = ctx.Products.Where(x => x.Rowstatus == true && x.Name == "Biaya Pemeliharaan").First().Price;
                    response.BPemotongan = ctx.Products.Where(x => x.Rowstatus == true && x.Name == "Biaya Pemotongan").First().Price;
                    response.IsSuccess = true;
                    response.Message = "Sukses load data.";
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

        public string GenerateCode(int lastID)
        {
            string result = string.Empty;
            result = DateTime.Now.ToString("yyyymmddHHmm") + (lastID + 1).ToString().PadLeft(5, '0');
            return result;
        }

        public Panitia GetPanitiaProduct(SMZEntities.SMZEntities ctx)
        {
            Panitia result = new Panitia();
            List<Prod> Listpro = (from pro in ctx.Products
                                  join ven in ctx.Vendors on pro.VendorID equals ven.ID
                                  where ven.Name == "panitia"
                                  select new Prod()
                                  {
                                      ID = pro.ID,
                                      Name = pro.Name
                                  }).ToList();
            result.PotongID = Listpro.Where(x => x.Name == "Biaya Pemotongan").First().ID;
            result.PeliharaID = Listpro.Where(x => x.Name == "Biaya Pemeliharaan").First().ID;
            result.InfaqID = Listpro.Where(x => x.Name == "Infaq").First().ID;
            return result;
        }

        public TransaksiResponse SubmitTransaksi(string submit, [FromBody] TransaksiRequest request)
        {
            TransaksiResponse response = new TransaksiResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    #region Insert in Product and Product history
                    ProductHistory ph = new ProductHistory();
                    Product product = ctx.Products.Where(x => x.Rowstatus == true && x.ID == request.Transaksi.ProductID).First();
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
                    product.ModifiedBy = "admin";
                    product.ModifiedOn = DateTime.Now;

                    ph.ProductID = product.ID;
                    ph.Name = product.Name;
                    ph.Price = product.Price;
                    ph.VendorID = product.VendorID;
                    ph.Product = product;
                    ph.Stok = product.Stok;
                    ph.LastNumber = product.LastNumber;
                    ph.CreatedBy = "admin";
                    ph.CreatedOn = DateTime.Now;
                    ctx.ProductHistories.Add(ph);
                    #endregion

                    #region Insert table Nota
                    List<Nota> ListNota = ctx.Notas.Where(x => x.RowStatus == true).ToList();
                    int lastNotaID = (ListNota.Count == 0) ? 0 : ctx.Notas.Max(x => x.ID);
                    string famzID = string.Empty;
                    Nota nota = new Nota();
                    nota.CustomerID = request.Transaksi.CustomerID;
                    foreach (var item in request.Transaksi.FamilyID)
                    {
                        famzID = famzID + "," + item.ToString();
                    }
                    nota.FamilyID = famzID;
                    nota.TransactionDate = DateTime.Now;
                    nota.Note = request.Transaksi.Note;
                    nota.NotaCode = GenerateCode(lastNotaID);
                    nota.CreatedBy = "admin";
                    nota.CreatedOn = DateTime.Now;
                    nota.RowStatus = true;
                    ctx.Notas.Add(nota);
                    #endregion

                    #region Insert table Nota Detail
                    NotaDetail notaDetail = new NotaDetail();
                    Panitia PanitiaProd = GetPanitiaProduct(ctx);
                    if (request.Transaksi.BiayaPemeliharaan > 0)
                    {
                        NotaDetail nd = new NotaDetail();
                        nd.NotaID = nota.ID;
                        nd.Nota = nota;
                        nd.Price = request.Transaksi.BiayaPemeliharaan;
                        nd.Total = 1;
                        nd.ProductID = PanitiaProd.PeliharaID;
                        nd.CreatedBy = "admin";
                        nd.CreatedOn = DateTime.Now;
                        nd.RowStatus = true;
                        ctx.NotaDetails.Add(nd);

                    }

                    if (request.Transaksi.BiayaPemotongan > 0)
                    {
                        NotaDetail ndPtong = new NotaDetail();
                        ndPtong.NotaID = nota.ID;
                        ndPtong.Nota = nota;
                        ndPtong.Price = request.Transaksi.BiayaPemotongan;
                        ndPtong.Total = 1;
                        ndPtong.ProductID = PanitiaProd.PotongID;
                        ndPtong.CreatedBy = "admin";
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
                        ndInfaq.CreatedBy = "admin";
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
                    notaDetail.CreatedBy = "admin";
                    notaDetail.CreatedOn = DateTime.Now;
                    notaDetail.RowStatus = true;
                    ctx.NotaDetails.Add(notaDetail);

                    #endregion

                    ctx.SaveChanges();
                    response.NotaCode = nota.NotaCode;
                    response.LastNumber = product.LastNumber.Value;
                    response.IsSuccess = true;
                    response.Message = "Transaksi berhasil.";
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

    }
}
