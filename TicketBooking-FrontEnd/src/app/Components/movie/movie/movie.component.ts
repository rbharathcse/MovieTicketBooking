import { Component, inject, OnInit } from '@angular/core';
import { movieStore } from '../../../Stores/movieStore/movie.store';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieModel, resShowDetails, showDetails } from '../../../Models/movie-details';
import {ButtonModule} from 'primeng/button'
import {FloatLabelModule} from 'primeng/floatlabel'
import {DatePicker, DatePickerModule} from 'primeng/datepicker'
import { FormsModule } from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber'
import { Toast } from 'primeng/toast';
import { ToasterService } from '../../../Services/toaster.service';
import {MessageModule} from 'primeng/message'

@Component({
  selector: 'app-movie',
  imports: [CommonModule,ButtonModule,FloatLabelModule,FormsModule,InputNumberModule,DatePickerModule,MessageModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movieStore$ = inject(movieStore);
  movieId!: string | null;
  selectedMovie: resShowDetails | undefined;
  additionalDetails:MovieModel|undefined;
  movieShowArray:string[]|undefined;
  minDate:Date=new Date();
  maxDate:Date|undefined;
  seats:number|undefined;
  selectedDate: string | null = null;  
constructor(private route: ActivatedRoute,private router:Router, private toast:ToasterService) {
  }
  ngOnInit(): void {
 
   this.movieId = this.route.snapshot.paramMap.get('id');
   this.loadMovieDetails();
 
   

  }
  loadMovieDetails() {
    this.movieStore$.getMovies();
    this.movieStore$.getMovieDetails();
    this.movieStore$.getMovieAndDetails(this.movieId!);
   
    const interval = setInterval(() => {
      const details = this.movieStore$.showDetails();
      const baseDetails=this.movieStore$.movies();
      if (details.length > 0) {
        clearInterval(interval);
        this.additionalDetails=baseDetails.find((movie) => movie.id==this.movieId) as MovieModel;
        this.selectedMovie = details.find((show) => show.movieId === this.movieId) as resShowDetails;
        this.movieShowArray= this.selectedMovie?.showTime.split(',');
        // this.minDate=new Date(this.selectedMovie?.startDate);
        this.maxDate=new Date(this.selectedMovie?.endDate);
      }
     
    }, 100); 
 
 
  }
  onDateChange(event: Date) {
    if (event) {
      this.selectedDate = event.toISOString().split('T')[0];  
    }
  }

  check(show:string){
    if (!this.movieId || !this.seats || !this.selectedDate || !show) {
      this.toast.showToast('warn', 'Enter Date and seats');
      return;
    }
  
    this.router.navigate(['/movie', this.movieId, this.seats, this.selectedDate, show]);
  
  }

}
