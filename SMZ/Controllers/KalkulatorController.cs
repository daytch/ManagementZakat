using SMZ.Core;
using SMZ.Models.Request;
using SMZ.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ScrapySharp.Network;
using AngleSharp.Html.Parser;
using System.Text.RegularExpressions;
using System.Configuration;

namespace SMZ.Controllers
{
    public class KalkulatorController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static string urlEmas = ConfigurationManager.AppSettings["urlEmas"].ToString();
        private static string urlPerak = ConfigurationManager.AppSettings["urlPerak"].ToString();
        private static string SelectorEmas = "#container > div.row.space30 > div.col-md-4 > table > tbody > tr:nth-child(5) > td:nth-child(2)";
        private static string SelectorPerak = "#container > div.row.space30 > div.col-md-4 > table > tbody > tr:nth-child(6) > td:nth-child(2)";

        public class WebClientEx : WebClient
        {
            protected override WebRequest GetWebRequest(Uri address)
            {
                if (!(base.GetWebRequest(address) is HttpWebRequest request))
                    return base.GetWebRequest(address);
                request.AutomaticDecompression =
                    DecompressionMethods.Deflate | DecompressionMethods.GZip;
                return request;
            }
        }
        private static WebClient CreateClient()
        {
            var client = new WebClientEx();
            client.Headers.Add("Accept",
            "text/html,application/xhtml+xml,application/xml,application/json");
            client.Headers.Add("Accept-Encoding", "gzip, deflate");
            client.Headers.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0");
            return client;
        }

        [HttpPost]
        public KalkulatorResponse GetEmas(string GetEmas, [FromBody] KalkulatorRequest calc)
        {
            KalkulatorResponse response = new KalkulatorResponse();
            using (var ctx = new SMZEntities.SMZEntities())
            {
                string username = Security.ValidateToken(calc.Token);
                if (username != null)
                {
                    // Memanggil method CreateClient untuk membuat object WebClientEx baru.
                    WebClient client = CreateClient();
                    // Mendapatkan response berupa HTML string
                    string respEmas = client.DownloadString(urlEmas);
                    // Parse response menggunakan HtmlParser (AngleSharp)
                    HtmlParser parser = new HtmlParser();
                    AngleSharp.Html.Dom.IHtmlDocument parsedEmas = parser.ParseDocument(respEmas);
                    // Select element menggunakan selector dan ambil text content
                    string hargaEmas = parsedEmas.QuerySelector(SelectorEmas)?.TextContent;

                    string[] numbers = Regex.Split(hargaEmas, @"\D+");
                    int index = 0;
                    string emas = "";
                    foreach (string value in numbers)
                    {
                        if (!string.IsNullOrEmpty(value))
                        {
                            if (value.Count() == 3 || (value.Count() == 1 && index == 0))
                            {
                                emas = emas+value;
                            }
                            index++;
                        }
                    }
                    response.Emas = int.Parse(emas);
                    string respPerak = client.DownloadString(urlPerak);
                    AngleSharp.Html.Dom.IHtmlDocument parsedPerak = parser.ParseDocument(respPerak);
                    string hargaPerak = parsedPerak.QuerySelector(SelectorPerak)?.TextContent;
                    string[] numberPerak = Regex.Split(hargaPerak, @"\D+");
                    index = 0;
                    string perak = "";
                    foreach (string value in numberPerak)
                    {
                        if (!string.IsNullOrEmpty(value))
                        {
                            if (value.Count() == 3 || (value.Count() == 1 && index == 0))
                            {
                                perak = perak + value;
                            }
                            index++;
                        }
                    }
                    response.Perak = int.Parse(perak);
                    response.IsSuccess = true;
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

    }
}
