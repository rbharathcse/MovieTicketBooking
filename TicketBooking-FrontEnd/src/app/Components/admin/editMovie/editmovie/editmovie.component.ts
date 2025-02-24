import { Component, inject, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table'
import { MovieModel } from '../../../../Models/movie-details';
import { movieStore } from '../../../../Stores/movieStore/movie.store';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editmovie',
  imports: [TableModule,ButtonModule,RouterLink],
  templateUrl: './editmovie.component.html',
  styleUrl: './editmovie.component.css'
})
export class EditmovieComponent implements OnInit {

 movieStore = inject(movieStore);
 sno:number=0;
 snum:string='';
 ngOnInit(): void {
  this.movieStore.getMovies();
  this.sno=this.sno+1;
  this.snum=this.pad(this.sno)
  
}
delete(movieId:string):void{
  this.movieStore.deleteMovie(movieId);
}
pad(num:number):string{
  return num.toString().padStart(2,'0')
}

}
