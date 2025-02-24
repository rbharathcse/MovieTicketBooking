import { computed, Injectable, OnInit } from '@angular/core';
import { User } from '../Models/user';
import { userProfile } from '../Models/userProfile';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  
  constructor(private route: Router) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user'); 
    if (token && user) {
      this.currentUser = JSON.parse(user);
      this.loggedInSubject.next(true);
    } else {
      this.loggedInSubject.next(false);
    }
  }
  currentUser!: userProfile;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  setCurrentuser(user: userProfile) {
    this.currentUser = user;
   localStorage.setItem('user', JSON.stringify(user)); 
  if (this.currentUser && localStorage.getItem('token')) {
    this.loggedInSubject.next(true);
  }
  }

  
  unsetCurrentuser() {
    this.currentUser!=null;
    localStorage.removeItem('user'); // Remove user info from localStorage
    this.loggedInSubject.next(false); 
  }
  logout():void{
    this.unsetCurrentuser();
    localStorage.clear();
    this.route.navigateByUrl('/');
  }
}

