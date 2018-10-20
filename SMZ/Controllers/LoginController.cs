using SMZ.Models.Request;
using SMZ.Models.Response;
using SMZ.Core;
using SMZEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Web.Http;

namespace SMZ.Controllers
{
    public class LoginController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        [HttpPost]
        public LoginResponse LogMeIn(string login, [FromBody] LoginRequest request)
        {
            LoginResponse response = new LoginResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    byte[] pass = Security.GetSHA1(request.Username, request.Password);
                    User u = ctx.Users.Where(x => x.RowStatus == true && x.Email == request.Username && x.Password == pass).FirstOrDefault();
                    if (u != null)
                    {
                        response.Token = Security.GenerateToken(request.Username);
                        response.IsSuccess = true;
                    }
                    else
                    {
                        response.Message = "Oops sorry your username or password is wrong";
                        response.IsSuccess = false;
                    }
                }
            }
            catch (Exception ex)
            {
                log.Error("LoginController :" + ex.ToString());
                response.Message = "Oops sorry something went wrong in our system, please contact your administrator.";
                response.IsSuccess = false;
                return response;
                throw ex;
            }
            return response;
        }

    }
}
