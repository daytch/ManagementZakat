using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SMZ.PRESENTATION.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        //[HttpPost]
        //public ActionResult Login(Models.User user)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        if (user.IsValid(user.UserName, user.Password))
        //        {
        //            var a = Login(user.UserName, user.Password);
        //            if (a.Status.ToString() != "WaitingForActivation")
        //            {
        //                return RedirectToAction("Index", "Home");
        //            }
        //        }
        //        else
        //        {
        //            ModelState.AddModelError("", "Login data is incorrect!");
        //        }
        //    }
        //    return View(user);
        //}

        //public async Task<bool> Login(string username, string password)
        //{
        //    bool result = true;
        //    string apiUrl = ConfigurationManager.AppSettings["APIurl"];

        //    using (HttpClient client = new HttpClient())
        //    {
        //        var content = new
        //        {
        //            username = username,
        //            password = password
        //        };
        //        var json = JsonConvert.SerializeObject(content);
        //        var stringContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");

        //        client.BaseAddress = new Uri(apiUrl);
        //        client.DefaultRequestHeaders.Accept.Clear();
        //        client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                
        //        HttpResponseMessage response = await client.PostAsync(apiUrl, stringContent);
        //        if (response.IsSuccessStatusCode)
        //        {
        //            var data = response.Content.ReadAsStringAsync();//await response.Content.ReadAsStringAsync();
        //           // var table = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Data.DataTable>(data);
        //        }
        //    }
        //    return result;

        //}
    }
}