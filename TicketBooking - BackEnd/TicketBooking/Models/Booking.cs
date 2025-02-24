namespace TicketBooking.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public Guid MovieId { get; set; }
        public string Seats { get; set; }
        public DateOnly selectedDate { get; set; }

        public string show { get; set; }

        public virtual Movie movie {get; set;}
 

    }
}
