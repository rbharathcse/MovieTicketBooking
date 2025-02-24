using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TicketBooking.Models;

namespace TicketBooking.Database
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet properties
        public DbSet<UserModel> users { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<ShowDetails> shows { get; set; }
        public DbSet<Booking> booking { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ShowDetails>()
                .HasOne(s => s.Movie) 
                .WithMany() 
                .HasForeignKey(s => s.MovieId) 
                .OnDelete(DeleteBehavior.Cascade);

         
        }
    }
}