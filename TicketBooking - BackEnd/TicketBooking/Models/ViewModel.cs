namespace TicketBooking.Models
{
    public class ViewModel
    {
        public string[] ShowTime { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public int ScreenNumber { get; set; }
        public int TotalSeats { get; set; }
        public double TicketPrice { get; set; }
        public string MovieName { get; set; }
        public string MovieDescription { get; set; }
        public int MovieDuration { get; set; }
        public int MovieRating { get; set; }
        public DateOnly MovieReleaseDate { get; set; }
        public string MovieGenre { get; set; }
        public string MovieLanguage { get; set; }
        public string MovieUrl { get; set; }
    }
}
