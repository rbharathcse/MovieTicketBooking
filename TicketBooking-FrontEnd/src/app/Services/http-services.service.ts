import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { booking, User, UserViewModel } from '../Models/user';
import { UserCredentials } from '../Models/user-credentials';
import {  MovieModel, resShowDetails, showDetails } from '../Models/movie-details';


@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {

  constructor(private http:HttpClient) { }

  RegisterUsers(User:UserViewModel){
    return this.http.post("https://localhost:7101/api/User/add-User",User);

  }
  login(credentials:UserCredentials){
   return this.http.post("https://localhost:7101/api/User/login",credentials);
  }

  // getUsers(){
  //   return this.http.get("https://localhost:7101/api/User");
  // }

  getUserInfo(){
    return this.http.get("https://localhost:7101/api/User/userinfo");
  }

addMovie(movie: any): Observable<any> {
      const params = new HttpParams()
        .set('movieName', movie.movieName)
        .set('movieDescription', movie.movieDescription)
        .set('movieDuration', movie.movieDuration.toString())
        .set('movieRating', movie.movieRating.toString())
        .set('movieReleaseDate', movie.movieReleaseDate)
        .set('movieGenre', movie.movieGenre)
        .set('movieLanguage', movie.movieLanguage)
        .set('movieUrl', movie.movieUrl);
    
      return this.http.post("https://localhost:7101/api/Admin/add-Movie", null, { params });
    }
  getMovies(){
    return this.http.get<MovieModel[]>("https://localhost:7101/api/Admin/getMovies")
  }
  addShowDetails(show:showDetails,id:string):Observable<any>{
    const params = new HttpParams()
    .set('startDate', show.startDate)
    .set('endDate', show.endDate)
    .set('showTime', show.showTime.join(','))
    .set('movieId', show.movieId.toString())
    .set('screenNumber',show.screenNumber)
    .set('totalSeats',show.totalSeats)
    .set('ticketPrice', show.ticketPrice);

    return this.http.post(`https://localhost:7101/api/Admin/addShowDetails/${id}`,null,{params});
  }
  getShowDetails():Observable<resShowDetails[]>{
    return this.http.get<resShowDetails[]>(`https://localhost:7101/api/User/MovieDetails`);

  }

  addBooking(booking:booking):Observable<booking[]>{
    return this.http.post<booking[]>("https://localhost:7101/api/User/Booking",booking);
  }
  getBooking(movieId:string){
    return this.http.get<booking[]>(`https://localhost:7101/api/User/GetBooking`);
  }

  deleteMovie(movieId:string){
    return this.http.delete(`https://localhost:7101/api/Admin/deleteMovie/${movieId}`);
  }

  editMovie(movie:any, movieId:string){
   
  
  return this.http.put(`https://localhost:7101/api/Admin/editShowDetails/${movieId}`,movie);
  

  }
  getAllBookings(){
    return this.http.get<booking[]>("https://localhost:7101/api/User/AllBookings");
  }
    
  }


