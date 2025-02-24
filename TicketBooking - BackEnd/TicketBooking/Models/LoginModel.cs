using System.ComponentModel.DataAnnotations;

namespace TicketBooking.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage ="Email is Required")]
        [EmailAddress]

        public string email {  get; set; }

        [Required(ErrorMessage ="Password is Required")]
        public string password { get; set; }    
    }
}
