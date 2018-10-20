using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SMZ.PRESENTATION.Models
{
    public class User
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }
        
        public bool IsValid(string _username, string _password)
        {
            bool result = true;
            if (string.IsNullOrWhiteSpace(_username) && string.IsNullOrWhiteSpace(_password))
            {
                result = false;
            }
            return result;
        }
    }
}