using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketBooking.Database;
using TicketBooking.Models;

namespace TicketBooking.Controllers
{
    [Controller]
    //[Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public AdminController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("api/[controller]/add-Movie")]
        public async Task<IActionResult> Addmovie([FromQuery] MovieViewModel movieModel)
        {
            if (movieModel == null)
            {
                return BadRequest(new Response { status = "Failed", message = "Movie data is null" });
            }

            try
            {
                if (string.IsNullOrWhiteSpace(movieModel.movieName))
                {
                    return BadRequest(new Response { status = "Failed", message = "Movie name is required" });
                }

                if (string.IsNullOrWhiteSpace(movieModel.movieUrl))
                {
                    return BadRequest(new Response { status = "Failed", message = "Movie URL is required" });
                }

                if (movieModel.movieReleaseDate == default)
                {
                    return BadRequest(new Response { status = "Failed", message = "Valid movie date is required" });
                }
                var movie = new Movie
                {
                    movieName = movieModel.movieName,
                    movieDescription = movieModel.movieDescription,
                    movieDuration = movieModel.movieDuration,
                    movieGenre = movieModel.movieGenre,
                    movieLanguage = movieModel.movieLanguage,
                    movieRating = movieModel.movieRating,
                    movieReleaseDate = movieModel.movieReleaseDate,
                    movieUrl = movieModel.movieUrl,

                };
                var result = await dbContext.Movies.AddAsync(movie);
                await dbContext.SaveChangesAsync();
                return Ok(new Response { status = "Success", message = "Movie added successfully" });
            }
            catch (DbUpdateException dbEx)
            {
                Console.Error.WriteLine($"Database update error: {dbEx.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    status = "Failed",
                    message = "A database error occurred while adding the movie. Please retry."
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    status = "Failed",
                    message = "An unexpected error occurred. Please retry."
                });
            }



        }
        [HttpGet]
        [Route("api/[Controller]/getMovies")]
        public async Task<ActionResult> GetMovies()
        {
            var movies = await dbContext.Movies.ToListAsync();
            return Ok(movies);
        }
        [HttpPost]
        [Route("api/[Controller]/addShowDetails/{id}")]
        public async Task<ActionResult> AddShowDetails(Guid id,showDetailsViewModel model)
        {
            if (ModelState.IsValid)
            {
                string showTime = String.Join(",", model.showTime);

                var show = new ShowDetails
                {
                    ticketPrice = model.ticketPrice,
                    totalSeats = model.totalSeats,
                    showTime = showTime,
                    screenNumber = model.screenNumber,
                    startDate = model.startDate,
                    endDate = model.endDate,
                    MovieId=id,
                

                };
                await dbContext.shows.AddAsync(show);
                await dbContext.SaveChangesAsync();
                return StatusCode(StatusCodes.Status201Created, new Response { message = "Successfully added", status = "success" });
            }
            return BadRequest(new Response { status = "Error", message = "Retry Again later" });
        }

        [HttpPut]
        [Route("api/[controller]/editShowDetails/{movieId}")]
        public async Task<ActionResult> EditShowDetails(Guid movieId, [FromBody] ViewModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.MovieName))
            {
                return BadRequest(new Response { message = "Movie details are required", status = "Error" });
            }

            var movie = await dbContext.shows
                .Include(x => x.Movie)
                .FirstOrDefaultAsync(x => x.Movie.Id == movieId);

            if (movie == null)
            {
                return NotFound(new Response { message = "Movie not found", status = "Error" });
            }

            // Update movie details
            movie.startDate = model.StartDate;
            movie.endDate = model.EndDate;
            movie.showTime = string.Join(",", model.ShowTime);
            movie.screenNumber = model.ScreenNumber;
            movie.ticketPrice = model.TicketPrice;
            movie.totalSeats = model.TotalSeats;

            movie.Movie.movieName = model.MovieName;
            movie.Movie.movieDescription = model.MovieDescription;
            movie.Movie.movieDuration = model.MovieDuration;
            movie.Movie.movieRating = model.MovieRating;
            movie.Movie.movieReleaseDate = model.MovieReleaseDate;
            movie.Movie.movieGenre = model.MovieGenre;
            movie.Movie.movieLanguage = model.MovieLanguage;
            movie.Movie.movieUrl = model.MovieUrl;

            dbContext.Entry(movie).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();

            return Ok(new Response { status = "Success", message = "Successfully updated" });
        }


        [HttpDelete]
        [Route("api/[controller]/deleteMovie/{id}")]
        public async Task<ActionResult> deleteMovie(Guid id)
        {
            var movie = await dbContext.Movies.FindAsync(id);
            if(movie == null)
            {
                return NotFound();
            }
            else
            {
                dbContext.Movies.Remove(movie);
                dbContext.SaveChanges();
                return Ok(new Response { status = "success", message = "Movie Deleted Successfully" });
            }

        }
    }
    }
