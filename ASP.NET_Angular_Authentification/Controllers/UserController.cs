namespace ASP.NET_Angular_Authentification.Controllers;

using ASP.NET_Angular_Authentification.Context;
using ASP.NET_Angular_Authentification.Models;
using Microsoft.AspNetCore.Mvc;

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

        this.context.Users.Add(userObj);
        this.context.SaveChanges();
        return this.Ok(new { message = "User Registred!" });
    }
}
