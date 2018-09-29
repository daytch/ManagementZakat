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
using System.Security.Cryptography;

namespace SMZ.Controllers
{
    public class UserController : ApiController
    {
        #region Private
        private DateTime NOW = DateTime.Now;
        #endregion
        [HttpPost]
        public UserResponse Save(string save, [FromBody] UserRequest request)
        {
            UserResponse response = new UserResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    User user = new User();
                    if (ctx.Users.Any(o => o.Email == request.Email && o.RowStatus == true))
                    {
                        user = ctx.Users.Where(o => o.Email == request.Email).First();
                        user.Password = Security.GetSHA1(request.Email, request.Password);
                        user.ModifiedBy = "system";
                        user.ModifiedOn = NOW;
                        response.Message = "Your data has been changed";
                    }
                    else
                    {
                        user.Email = request.Email; 
                        user.Password = Security.GetSHA1(request.Email, request.Password);
                        user.CreatedBy = "System";
                        user.CreatedOn = NOW;
                        user.RowStatus = true;
                        ctx.Users.Add(user);
                        response.Message = "Your data has been saved";
                    }
                    ctx.SaveChanges();
                    response.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return response;
        }

        [HttpGet]
        public UserResponse Load(string load, [FromUri] UserRequest request)
        {
            UserResponse response = new UserResponse();
            try
            {
                using (var ctx = new SMZEntities.SMZEntities())
                {
                    List<User> ListUser = ctx.Users.Where(x => x.RowStatus == true).ToList();
                    response.data = ListUser;
                    response.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return response;
        }
    }
}
