import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { movieStore } from '../../../Stores/movieStore/movie.store';
import { MovieModel, resShowDetails } from '../../../Models/movie-details';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { HttpServicesService } from '../../../Services/http-services.service';
import { ToasterService } from '../../../Services/toaster.service';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-show-edit',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, DatePickerModule,ReactiveFormsModule,FormsModule,SelectModule],
  templateUrl: './show-edit.component.html',
  styleUrl: './show-edit.component.css'
})
export class ShowEditComponent implements OnInit {
  id: string = "";
  movieStore$ = inject(movieStore);
  selectedMovie: MovieModel | undefined;
  showDetails: resShowDetails | undefined;
  showTime: string[] = ['Morning Show', 'Matinee Show', 'Evening Show', 'Night Show'];
  selectedShowTime: string[] = [];
  dateRange: Date[] = [];
  genre:string[]=[];

  movieShowForm: FormGroup = new FormGroup({
    dateRange: new FormControl<Date[]>([], [Validators.required]),
    showTime: new FormControl<string[]>([], [Validators.required]),
    ticketPrice: new FormControl('', [Validators.required]),
    screenNumber: new FormControl('', [Validators.required]),
    totalSeats: new FormControl('', [Validators.required]),
    movieName: new FormControl('', [Validators.required]),
    movieUrl: new FormControl('', [Validators.required]),
    movieRating: new FormControl('', [Validators.required]),
    movieReleaseDate: new FormControl('', [Validators.required]),
    movieDescription: new FormControl('', [Validators.required]),
    movieDuration: new FormControl('', [Validators.required]),
    movieGenre: new FormControl('', [Validators.required]),
    movieLanguage: new FormControl('', [Validators.required]),
  });

  constructor(private route: ActivatedRoute,private httpService:HttpServicesService,private toast:ToasterService) {
    this.id =this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.genre=[  "ACTION",
          "COMEDY",
          "DRAMA",
          "HORROR",
          "ROMANCE",
          "THRILLER"];
    this.movieStore$.getMovies();
    this.movieStore$.getMovieDetails();

    // Find movie and show details
    this.movieStore$.Movies().forEach(movie => {
      if (movie.id === this.id) {
        this.selectedMovie = movie;
      }
    });

    this.movieStore$.ShowDetails().forEach(show => {
      if (show.movieId === this.id) {
        this.showDetails = show;
      }
    });

    if (this.selectedMovie && this.showDetails) {
      this.populateForm();
    }
  }

  populateForm() {
    if (!this.selectedMovie || !this.showDetails) return;

    this.movieShowForm.patchValue({
      dateRange: [new Date(this.showDetails.startDate), new Date(this.showDetails.endDate)],
      showTime: this.showDetails.showTime,
      ticketPrice: this.showDetails.ticketPrice,
      screenNumber: this.showDetails.screenNumber,
      totalSeats: this.showDetails.totalSeats,
      movieName: this.selectedMovie.movieName,
      movieUrl: this.selectedMovie.movieUrl,
      movieRating: this.selectedMovie.movieRating,
      movieReleaseDate: this.selectedMovie.movieReleaseDate,
      movieDescription: this.selectedMovie.movieDescription,
      movieDuration: this.selectedMovie.movieDuration,
      movieGenre: this.selectedMovie.movieGenre,
      movieLanguage: this.selectedMovie.movieLanguage
    });
  }

  submitForm() {
    if (this.movieShowForm.valid) {
      const formValues = this.movieShowForm.value;
   
  
      const params = {
        showTime:  formValues.showTime,
        startDate: formValues.dateRange[0]?.toISOString().split('T')[0],
        endDate: formValues.dateRange[1]?.toISOString().split('T')[0],
        screenNumber: formValues.screenNumber,
        totalSeats: formValues.totalSeats,
        ticketPrice: formValues.ticketPrice,
        movieName: formValues.movieName,
        movieDescription: formValues.movieDescription,
        movieDuration: formValues.movieDuration,
        movieRating: formValues.movieRating,
        movieReleaseDate: formValues.movieReleaseDate,
        movieGenre: formValues.movieGenre,
        movieLanguage: formValues.movieLanguage,
        movieUrl: formValues.movieUrl
      };
      console.log(params);
  
      this.httpService.editMovie(params, this.id).subscribe({
        next: (res) => {
          this.toast.showToast('success', 'Movie Updated Successfully');
        },
        error: (err) => {
          console.error("Error updating movie:", err);
          this.toast.showToast('error', 'Failed to update movie');
        }
      });
    } else {
      this.toast.showToast('error', 'Please fill all fields');
    }
  }
  
  
  
  
}
