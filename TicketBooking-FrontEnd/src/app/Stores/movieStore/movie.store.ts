import { computed, inject } from "@angular/core";
import { MovieModel, resShowDetails, Show, showDetails } from "../../Models/movie-details";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { HttpServicesService } from "../../Services/http-services.service";
import { map, tap } from "rxjs";
import { ToasterService } from "../../Services/toaster.service";
import { booking } from "../../Models/user";

type MovieState = {
  Movies: MovieModel[];
  ShowDetails: resShowDetails[];
  Booking:booking[];
  selectedMovie: MovieModel | undefined;
  selectedMovieDetails:resShowDetails|undefined;
};

const initialState: MovieState = {
  Movies: [],
  ShowDetails: [],
  Booking:[],
  selectedMovie: undefined,
  selectedMovieDetails:undefined,
};

export const movieStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store)=>({
    movies:computed(()=>store.Movies()),
    showDetails:computed(()=>store.ShowDetails()),
    booking:computed(()=>store.Booking()),
  })),
  withMethods((store, httpService = inject(HttpServicesService),toaster=inject(ToasterService)) => ({
    getMovies() {
      return httpService.getMovies().pipe(tap(data=>{
        patchState(store,{
          Movies:data
        }
        )
      }))

    },
    getMovieDetails(){
    
      return httpService.getShowDetails().pipe(map((data)=>data)).subscribe({
        next:(data)=>{
             patchState(store,{
              ShowDetails:data
             })
             
      },
      error:(err)=>{
        console.error('Error fetching movie details:', err);
      }
    })
    },
    getMovieAndDetails(movieId:string){
       const movie=store.Movies().find((movie)=>movie.id===movieId);
       const showDetails=store.ShowDetails().find((Show)=>Show.movieId===movieId);
       patchState(store,{
        selectedMovie:movie,
        selectedMovieDetails:showDetails
       });

    },

    getAllBookings(){
      return httpService.getAllBookings().pipe(tap({
        next:(data)=>{
          patchState(store,{
            Booking:data
          })
        }
      }))
    },
    
   getBooking(movieId:string){
      return httpService.getBooking(movieId).pipe(map((data)=>data)).pipe(tap({
        next:(data)=>{
          patchState(store,{
            Booking:data
          })
        }
      }))
    },
    addMovie(newMovie:any) {
      return httpService.addMovie(newMovie).subscribe({
        next: (movie) => {
          if(movie){
            toaster.showToast('success','Movie added successfully');
          patchState(store, {
            Movies: [...store.Movies(), movie] 
          });
        }
      },
        error: (err) => {
          console.error('Error adding movie:', err);
        }
      });
    },
    addMovieShowDetails(showDetails:any,id:string){
      return httpService.addShowDetails(showDetails,id).subscribe({
        next:(data)=>{
          if(data){
            toaster.showToast('success','Show details added successfully');
            patchState(store,{
              ShowDetails:[...store.ShowDetails(),data]
            }

            )
          }
          else{
            toaster.showToast('error','Error adding show details');
          }
        }
      })
    },
    addBooking(booking:any){
      return httpService.addBooking(booking).subscribe({
        next:(data)=>{
          patchState(store,{
            Booking:data
          })
        },
        error:(err)=>{
          toaster.showToast('error','Error adding booking');
        }
      })
    },
    deleteMovie(movieId:string){
      return httpService.deleteMovie(movieId).subscribe({
        next:(data)=>{
          toaster.showToast('success','Movie deleted successfully');
          patchState(store,{
            Movies:store.Movies().filter((movie)=>movie.id !== movieId)
          })
        },
        error:(err)=>{
          
          toaster.showToast('error','Error deleting movie,Try Again');
        }
      })
    }
  }))

);
