import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthServiceService } from '../Services/auth-service.service';
import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[appAuth]'
})
export class AuthDirective  implements OnInit{
 
constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef,private authService:AuthServiceService) {}
@Input() appAuth:boolean=false;
subscription!:Subscription;
  ngOnInit(): void {
    this.subscription = this.authService.loggedIn$.subscribe((isLoggedIn) => {
      const isAdmin =
        this.authService.currentUser &&
        (this.authService.currentUser.role === 'admin' || this.authService.currentUser.role === 'Admin');
      if (isLoggedIn && isAdmin) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
  ngOnDestroy(): void {
    if(this.subscription){
    this.subscription.unsubscribe();
    }
    
  }


 

  

}
