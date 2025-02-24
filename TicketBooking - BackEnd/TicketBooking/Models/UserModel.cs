using Microsoft.AspNetCore.Identity;

namespace TicketBooking.Models
{
    public class UserModel:IdentityUser
    {
     
        public string Name { get; set; }
      
    }
}
