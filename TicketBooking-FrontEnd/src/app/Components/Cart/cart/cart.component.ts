import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { movieStore } from '../../../Stores/movieStore/movie.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [DatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  booking:any;
  userId:string="";
  movieStore$=inject(movieStore);
  constructor(private route:ActivatedRoute){}
  userBooking = computed(() => {
    return this.movieStore$
      .booking()
      .filter((book) => book.userId === this.userId)
      .map((book) => {
        let movie = this.movieStore$.movies().find((movie) => movie.id === book.movieId);
        
        return {
          ...book, 
          movieName: movie ? movie.movieName : "Unknown Movie" 
        };
      });
  });
  


  ngOnInit(): void {
    this.movieStore$.getMovies().subscribe();
    this.movieStore$.getAllBookings().subscribe();
   this.userId=this.route.snapshot.paramMap.get('userId')!;
  }
  
  

}
