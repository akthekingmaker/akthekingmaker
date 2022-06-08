import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthPayloadResponse, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  isError!: string;

  constructor(private AuthService: AuthService,private router: Router){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    let authobs: Observable<AuthPayloadResponse>
    if(this.isLoginMode){
      authobs = this.AuthService.Login(email,password);
    }
    else{
    authobs = this.AuthService.Signup(email,password);
    }

    authobs.subscribe(payloadRes =>{
      console.log(payloadRes);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    },errorMes =>{
      console.log(errorMes);
      this.isError = errorMes;
      this.isLoading = false;
    });    
    form.reset();
  }

  onHandleError(){
    this.isError = null!;
  }
}
