using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TicketBooking.Database;
using TicketBooking.Models;

namespace TicketBooking.Controllers
{
    [Controller]
    [Route("api/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration iconfiguration;

        public UserController(ApplicationDbContext dbContext, UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager,IConfiguration iconfiguration)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.iconfiguration = iconfiguration;
        }
        [HttpPost]
        [Route("add-User")]
        public async Task<IActionResult> AddUsers([FromBody] UserViewModel userViewModel)
        {
            var userExists = await userManager.FindByEmailAsync(userViewModel.Email);
            if (userExists is not null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { status = "Error", message = "User Already Exists" });
            }

            var userModel = new UserModel
            {
                UserName = userViewModel.Email,
                Email = userViewModel.Email,
                Name = userViewModel.Name
            };

            var result = await userManager.CreateAsync(userModel, userViewModel.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    status = "Error",
                    message = string.Join("; ", result.Errors.Select(e => e.Description)) 
                });
            }
            if (await roleManager.RoleExistsAsync(UserRoles.User))
            {
                await userManager.AddToRoleAsync(userModel, UserRoles.User);
            }

            return StatusCode(StatusCodes.Status200OK, new Response { status = "Success", message = "User Created" });
        }

        [HttpPost("register-Admin")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult> RegisterAdmin(UserViewModel userViewModel)
        {
            var admin=await userManager.FindByEmailAsync(userViewModel.Email);
            if(admin is not null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { status = "Error", message = "Admin already exist" });
            }
            var user = new UserModel
            {
                UserName = userViewModel.Email,
                Email = userViewModel.Email,
                Name = userViewModel.Name
            };

            var adminCreated = await userManager.CreateAsync(user, userViewModel.Password);
            if (!adminCreated.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,new Response { status = "Error", message = string.Join("", adminCreated.Errors.Select(e => e.Description)) });
            }
            else
            {
                if (! await roleManager.RoleExistsAsync(UserRoles.User))
                {
                    roleManager.CreateAsync(new IdentityRole(UserRoles.User));
                }
                if(! await roleManager.RoleExistsAsync(UserRoles.Admin))
                {
                    roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
                }
                if(await roleManager.RoleExistsAsync(UserRoles.Admin))
                {
                    await userManager.AddToRoleAsync(user, UserRoles.Admin);
               }

            return Ok(new Response { status = "Success", message = "User created successfully!" });
        
         }
     }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody]LoginModel loginModel)
        {
            var user = await userManager.FindByEmailAsync(loginModel.email);
            if (user is not null && await userManager.CheckPasswordAsync(user, loginModel.password))
            {

                var userRoles = await userManager.GetRolesAsync(user);
                var userId = await userManager.GetUserIdAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,loginModel.email),
                    new Claim("userId",userId),
                    new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
                };

                foreach(var roles in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role,roles));
                }
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(iconfiguration["Jwt:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: iconfiguration["Jwt:ValidIssuer"],
                    audience: iconfiguration["Jwt:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey,SecurityAlgorithms.HmacSha256)

                    );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration=token.ValidTo
                });
            }
            return Unauthorized();

        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult GetUsers()
        {
           return Ok(dbContext.Users.ToList());
        }
        [HttpGet("userinfo")]
        public IActionResult GetUserInfo()
        {
            var user = HttpContext.User;

            var userId = user.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            var email = user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
            var role = user.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

           
            return Ok(new UserInfo
            {
                Id=userId,
                Email = email,
                Role = role
            });
        }

        [HttpGet("MovieDetails")]
        public async Task<ActionResult> GetMovieDetails()
        {
            var movieDetails = await dbContext.shows.ToListAsync();
            if(movieDetails is null)
            {
                return BadRequest(new Response { message = "No records Was found", status = "Not Found" });
            }
            else
            {
                return Ok(movieDetails);
            }
        }


        [HttpPost("Booking")]
public async Task<ActionResult> Booking([FromBody] Booking booking)
{
    
    if (booking == null || string.IsNullOrWhiteSpace(booking.Seats))
    {
        return BadRequest(new Response { status = "Error", message = "Invalid booking details." });
    }

    
    string[] seats = booking.Seats.Split(',');
    if (seats.Length == 0)
    {
        return BadRequest(new Response { status = "Error", message = "No seats selected." });
    }

    using var transaction = await dbContext.Database.BeginTransactionAsync();
    try
    {
        var movie = await dbContext.shows.FirstOrDefaultAsync(x => x.Movie.Id == booking.MovieId);
                if (movie == null)
                {
                    return NotFound(new Response { status = "Error", message = "Movie not found." });
                }
        if (movie.totalSeats < seats.Length)
        {
            return BadRequest(new Response { status = "Error", message = "Not enough seats available." });
        }

  
        movie.totalSeats -= seats.Length;
        dbContext.shows.Update(movie);

        var newBooking =new Booking
        {
            UserId = booking.UserId,
            MovieId = booking.MovieId,
            Seats = booking.Seats,
            selectedDate=booking.selectedDate,
            show=booking.show,
          
        };
        await dbContext.booking.AddAsync(newBooking);
       await dbContext.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new Response { status = "Success", message = "Booking successful." });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        return StatusCode(StatusCodes.Status500InternalServerError, new Response { status = "Error", message = ex.Message });
    }
}
        [HttpGet("GetBooking/{movieId}")]
        public async Task<IActionResult> GetBookings(Guid movieId)
        {
            var books = await dbContext.booking.Where(x => x.MovieId == movieId).ToListAsync();
            return Ok(books);
        }

        [HttpGet("AllBookings")]
        public async Task<IActionResult> AllBookings()
        {
            return Ok(await dbContext.booking.ToListAsync());
        }


       


    }
}