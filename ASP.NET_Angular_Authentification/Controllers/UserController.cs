namespace ASP.NET_Angular_Authentification.Controllers;

using System;
using System.Text;
using System.Text.RegularExpressions;
using ASP.NET_Angular_Authentification.Context;
using ASP.NET_Angular_Authentification.Helpers;
using ASP.NET_Angular_Authentification.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDbContext context;

    public UserController(AppDbContext context) => this.context = context;

    [HttpPost("login")]
    public IActionResult Login(User userObj)
    {
        if (userObj == null)
        {
            return this.BadRequest();
        }

        var user = this.context.Users
                       .FirstOrDefault(u => u.Email == userObj.Email &&
                       Equals(u.Password, userObj.Password));
        if (user == null)
        {
            return this.NotFound(new { message = "User not Found!" });
        }

        return this.Ok(new { message = "Login Success!" });
    }

    [HttpPost("register")]
    public IActionResult Register(User userObj)
    {
        if (userObj == null)
        {
            return this.BadRequest();
        }

        // Check Email
        if (this.CheckEmailExistAsync(userObj.Email).Result)
        {
            return this.BadRequest(new { message = "Email already Exist!" });
        }
        // Check Password Strenght
        var passw = CheckPassswortStrenght(userObj.Password);
        if (string.IsNullOrEmpty(passw))
        {
            return this.BadRequest(new { message = passw });
        }

        userObj.Password = PasswordHasher.HashPassword(userObj.Password);
        userObj.Role = "User";
        userObj.Token = "";

        this.context.Users.Add(userObj);
        this.context.SaveChanges();
        return this.Ok(new { message = "User Registred!" });
    }

    private static string CheckPassswortStrenght(string password)
    {
        var patternAlphaNummeric = "^(?=.*[a-zA-Z])(?=.*[0-9]).+$";
        var patternSpecialCharacters = "^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$";
        var sb = new StringBuilder();
        if (password.Length < 8)
        {
            sb.Append("Password should consist of at least 8 characters!");
        }
        if (!Regex.IsMatch(password, patternAlphaNummeric))
        {
            sb.Append("The password should contain one lowercase-, one uppercase letter and one number!" + Environment.NewLine);
        }
        if (!Regex.IsMatch(password, patternSpecialCharacters))
        {
            sb.Append("The password should contain one special character!" + Environment.NewLine);
        }

        return sb.ToString();
    }

    private Task<bool> CheckEmailExistAsync(string email) => this.context.Users.AnyAsync(u => Equals(u.Email.ToUpper(), email.ToUpper()));
}
