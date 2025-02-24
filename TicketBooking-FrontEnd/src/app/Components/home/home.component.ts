import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { movieStore } from '../../Stores/movieStore/movie.store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit   {
 
 
  movieStore$ = inject(movieStore);

  searchQuery = signal<string>('');

  filteredMovies = computed(() => {
    return this.movieStore$.movies().filter(movie =>
      movie.movieName.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  filter(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  ngOnInit(): void {
     this.movieStore$.getMovies().subscribe();
  }

  

  
}
