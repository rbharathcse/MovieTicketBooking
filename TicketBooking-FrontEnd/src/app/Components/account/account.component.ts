import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, output, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { HttpServicesService } from '../../Services/http-services.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { userProfile } from '../../Models/userProfile';
import { ToasterService } from '../../Services/toaster.service';
import { Toast,ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  constructor(private httpservice: HttpServicesService,private route:Router) {}
 @Output() message:string='';
 @Output() severity:string='';
  
  loginClicked: boolean = false;
  Toaster=inject(ToasterService);
  
  change(): void {
    this.loginClicked = !this.loginClicked;
   
  }

  // Password match validator
  passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const rFormGroup = control as FormGroup;
    const password = rFormGroup.get('password');
    const cpassword = rFormGroup.get('cpassword');
    if (password && cpassword && cpassword.touched && password.value !== cpassword.value) {
      return { mismatch: true };
    }
    return null;
  };

  formgroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

 
  registerFormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(10)]),
      cpassword: new FormControl('', [Validators.required, Validators.minLength(10)]),
    },
    { validators: this.passwordValidator } 
  );
 
  register(): void {
    if (this.registerFormGroup.valid) {
      const user = {
        name: this.registerFormGroup.get('name')?.value || '',
        email: this.registerFormGroup.get('email')?.value || '',
        password: this.registerFormGroup.get('password')?.value || '',
      };
  
      this.httpservice.RegisterUsers(user).subscribe({
        next: (res: any) => {
          if (res) {
            this.Toaster.showToast('success','Registration Success') 
            this.change();
          }
        },
        error: (error) => {
          console.error('HTTP Error Response:', error);
          const errorMessage =
            error.error?.message || 'An error occurred during registration.';
            this.Toaster.showToast('error',errorMessage)
        },
      });
    } else {
      console.warn('Form is invalid');
    }
  }
  
  
  authService=inject(AuthServiceService)
  login():void{
    const user={
      email:this.formgroup.get('email')?.value||'',
      password:this.formgroup.get('password')?.value||''
    }
    this.httpservice.login(user).subscribe({next:(val:any)=>{
      this.Toaster.showToast('success','Login Success')
      localStorage.setItem('token',val.token);
      this.change();
      this.httpservice.getUserInfo().subscribe({
        next:(val:any)=>{
          this.authService.setCurrentuser(val);
        },
        error:(err:any)=>{
          console.log(err);
        }
      })
      this.route.navigateByUrl('/');
    },
     error:(err:any)=>{
         this.message="Invalid Credentials"
         this.Toaster.showToast('error','Invalid Credentials')

     }
  }
  )
    
  }
}
