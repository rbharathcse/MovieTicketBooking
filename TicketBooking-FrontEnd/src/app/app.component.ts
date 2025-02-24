import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from './Services/auth-service.service';
import { AuthDirective } from './directives/auth.directive';
import { EmailToNamePipe } from './pipes/email-to-name.pipe';
import { ToasterComponent } from './Components/Toaster/toaster/toaster.component';
import { PrimeIcons } from 'primeng/api';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, AuthDirective, EmailToNamePipe, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
 loggedIn$:boolean=false;
 name:string="";
 userId:string="";
  constructor(private authService:AuthServiceService)
  {
    this.authService.loggedIn$.subscribe((value)=>{
      this.loggedIn$=value;
      this.name=this.authService.currentUser.email;
      this.userId=authService.currentUser.id;
    })
  }
  title = 'TicketBooking';
 
  logout():void{
    this.authService.logout();
  }

  
}
