using System.ComponentModel.DataAnnotations;
using TicketBooking.Models;

public record Movie
{
    public Guid Id { get; set; }


    public string movieName { get; set; }

   
    public string movieDescription { get; set; }

    public int movieDuration { get; set; }

    public int movieRating { get; set; }

    public DateOnly movieReleaseDate { get; set; }

    public string movieGenre { get; set; }

    public string movieLanguage { get; set; }

    public string movieUrl { get; set; }
}
