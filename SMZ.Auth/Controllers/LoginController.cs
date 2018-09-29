using Microsoft.IdentityModel.Tokens;
using SMZ.Auth.Models;
using SMZ.Auth.Repositories;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace SMZ.Auth.Controllers
{
    public class LoginController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage Login(User user)
        {
            User u = new UserRepository().GetUser(user.Username);

            if (u == null)
                return Request.CreateResponse(HttpStatusCode.NotFound, "The user was not found.");

            bool credentials = u.Password.Equals(user.Password);

            if (!credentials) return Request.CreateResponse(HttpStatusCode.Forbidden,
                "The username/password combination was wrong.");

            return Request.CreateResponse(HttpStatusCode.OK, TokenManager.GenerateToken(user.Username));
        }

        [HttpGet]
        public HttpResponseMessage Validate(string token, string username)
        {
            bool exists = new UserRepository().GetUser(username) != null;

            if (!exists) return Request.CreateResponse(HttpStatusCode.NotFound, "The user was not found.");

            string tokenUsername = TokenManager.ValidateToken(token);

            if (username.Equals(tokenUsername))
                return Request.CreateResponse(HttpStatusCode.OK);

            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }
    }
}
