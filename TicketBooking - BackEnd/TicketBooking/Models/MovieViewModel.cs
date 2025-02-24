using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TicketBooking.Models
{
    public sealed record MovieViewModel

    {

        public string movieName { get; set; }
        public string movieDescription { get; set; }
        public int movieDuration { get; set; }
        public int movieRating { get; set; }  
        public DateOnly movieReleaseDate { get; set; }
        public string movieGenre { get; set; }
        public string movieLanguage { get; set; }
        public string movieUrl { get; set; }

    }
}
