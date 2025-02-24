namespace TicketBooking.Models
{
    public class ShowDetails
    {
        public Guid Id { get; set; }

        public string showTime { get; set; }

        public DateOnly startDate { get; set; }
        public DateOnly endDate { get; set; }
        public int screenNumber { get; set; }

        public int totalSeats { get; set; }

        public double ticketPrice { get; set; }
        public virtual Movie Movie { get; set; }

        public Guid MovieId { get; set; }

    }
}
