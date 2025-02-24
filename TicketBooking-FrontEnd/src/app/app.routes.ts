import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AccountComponent } from './Components/account/account.component';
import { AdminComponent } from './Components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { AddMovieComponent } from './Components/admin/addMovie/add-movie/add-movie.component';
import { EditmovieComponent } from './Components/admin/editMovie/editmovie/editmovie.component';
import { MovieComponent } from './Components/movie/movie/movie.component';
import { SeatComponent } from './Components/seats/seat/seat.component';
import { ShowEditComponent } from './Components/admin/show-edit/show-edit.component';
import { CartComponent } from './Components/Cart/cart/cart.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'account', component: AccountComponent },
    { path: 'movie/:id/:seats/:selectedDate/:show', component: SeatComponent }, 
    { path: 'movie/:id', component: MovieComponent },
    {
      path: 'admin',
      component: AdminComponent,
      canActivate: [authGuard],
      children: [
        { path: 'addmovie', component: AddMovieComponent },
        { path: 'editmovie', component: EditmovieComponent },
        {path:'editmovie/:id',component:ShowEditComponent}
      ],
    },
    {path:'cart/:userId',component:CartComponent}
      
  
];
