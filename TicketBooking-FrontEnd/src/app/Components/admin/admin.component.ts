import { CommonModule, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { timeInterval } from 'rxjs';
import {MenuModule} from 'primeng/menu';
import {BadgeModule} from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MenuModule,ButtonModule,RouterLink,RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
 
   items:MenuItem[]=[];
   ngOnInit(): void {
    this.items=[
      {
        label:'Add Movie',
        icon:'pi pi-plus',
        routerLink:'addmovie'
      },
      {
        label:'Edit Movie',
        icon:'pi pi-pencil',
        routerLink:'editmovie'
      },
      {
        label:'User Details',
        icon:'pi pi-user',
        routerLink:'userdetails'
      },
      {
        label:'News',
        icon:'pi pi-bell',
        routerLink:'/news'
      }
    ]
   }
  
   MovieForm=new FormGroup({
    name:new FormControl('',Validators.required),
    date: new FormControl('', Validators.required),
    time:new FormControl('',Validators.required),
    seats:new FormControl('',Validators.required),
    purl:new FormControl('',Validators.required)
  });
  
  AddMovie(){
    const movie={
      name:this.MovieForm.get('name')?.value,
      date:this.MovieForm.get('date')?.value,
      time:this.MovieForm.get('time')?.value,
      seats:this.MovieForm.get('seats')?.value,
      purl:this.MovieForm.get('purl')?.value   
    }
  
    if(movie.name=='' || movie.date==''|| movie.seats=='' || movie.time=='' || movie.purl==''){
      console.log("No Record");
    }
    else{
    this.MovieForm.reset();
    }
    
  }


}
