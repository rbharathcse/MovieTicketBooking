using System.ComponentModel.DataAnnotations;

namespace TicketBooking.Models
{
    public class UserViewModel
    {

        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(10)]
        public string Password { get; set; }
        
        
    }
}
