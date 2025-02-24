import { Component, inject, OnInit } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genre, MovieModel, Show, showDetails } from '../../../../Models/movie-details';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { HttpServicesService } from '../../../../Services/http-services.service';
import { ToasterService } from '../../../../Services/toaster.service';
import { CommonModule } from '@angular/common';
import { movieStore } from '../../../../Stores/movieStore/movie.store';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    FloatLabelModule,
    SelectModule,
    CommonModule,
    MultiSelectModule,
  ],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css'],
})
export class AddMovieComponent implements OnInit {
  date: Date | undefined;
  minDate: Date | undefined;
  genre: Genre[] = [];
  showTime: string[] = [];
  selectedShowTime: any[] = [];  
  language: string[] = ['English', 'Tamil'];
  movieStore$ = inject(movieStore);
  dateRange: Date[] = [];  
  format: string = 'yy-mm-dd';

  constructor(private toaster: ToasterService) {}

  ngOnInit(): void {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month;
    let prevYear = prevMonth === 11 ? year - 1 : year;

    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);

    this.genre = [
      Genre.ACTION,
      Genre.COMEDY,
      Genre.DRAMA,
      Genre.HORROR,
      Genre.ROMANCE,
      Genre.THRILLER,
    ];
    this.showTime=['Morning Show', 'Matinee Show', 'Evening Show', 'Night Show'];

    this.movieStore$.getMovies();
  }

  movieForm: FormGroup = new FormGroup({
    movieName: new FormControl('', [Validators.required]),
    movieDescription: new FormControl('', [Validators.required]),
    movieDuration: new FormControl('', [Validators.required]),
    movieRating: new FormControl('', [Validators.required]),
    movieReleaseDate: new FormControl('', [Validators.required]),
    movieGenre: new FormControl('', [Validators.required]),
    movieLanguage: new FormControl('', [Validators.required]),
    movieImage: new FormControl('', [Validators.required]),
  });

  movieShowForm: FormGroup = new FormGroup({
    movieId: new FormControl('', [Validators.required]),
    dateRange: new FormControl<Date[]>([], [Validators.required]),
    showTime: new FormControl<string[]>([], [Validators.required]),
    ticketPrice: new FormControl('', [Validators.required]),
    screenNumber: new FormControl('', [Validators.required]),
    totalSeats: new FormControl('', [Validators.required]),
  });

  addMovie() {
    if (this.movieForm.valid) {
      const movie = {
        movieName: this.movieForm.get('movieName')?.value,
        movieDescription: this.movieForm.get('movieDescription')?.value,
        movieDuration: this.movieForm.get('movieDuration')?.value,
        movieRating: this.movieForm.get('movieRating')?.value,
        movieReleaseDate: this.movieForm.get('movieReleaseDate')?.value,
        movieGenre: this.movieForm.get('movieGenre')?.value,
        movieLanguage: this.movieForm.get('movieLanguage')?.value,
        movieUrl: this.movieForm.get('movieImage')?.value,
      };
    
      this.movieStore$
        .addMovie(movie)
        .add(this.movieForm.reset());
    } else {
      this.toaster.showToast('error', 'Please fill all the fields');
    }
  }

  dateFormat(date: Date | undefined): string {
    if (!date || isNaN(date.getTime())) {
      return ''; 
    }
    const padStart = (value: number) => value.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = padStart(date.getMonth() + 1); 
    const day = padStart(date.getDate());
    return `${year}-${month}-${day}`;
  }

  
  addShowDetails() {
    
    let startDate = '';
    let endDate = '';
    let showTime: string[] = [];

    if (this.movieShowForm.valid) {
      if (this.dateRange && this.dateRange.length === 2) {
        startDate = this.dateFormat(this.dateRange[0]);
        endDate = this.dateFormat(this.dateRange[1]);
      } else {
        this.toaster.showToast('error', 'Please select a valid date range');
      }

      if (this.selectedShowTime.length > 0) {
        showTime = this.selectedShowTime;
      } else {
        this.toaster.showToast('error', 'Please select show time');
      }

      const showDetails:any = {
        movieId: this.movieShowForm.get('movieId')?.value,
        startDate: startDate,
        endDate: endDate,
        showTime: showTime,
        ticketPrice: this.movieShowForm.get('ticketPrice')?.value,
        screenNumber: this.movieShowForm.get('screenNumber')?.value,
        totalSeats: this.movieShowForm.get('totalSeats')?.value,
      };
      this.movieStore$.addMovieShowDetails(showDetails,this.movieShowForm.get('movieId')?.value).add(this.movieShowForm.reset());
      // this.movieStore$.getMovies();
    }
  }
}
