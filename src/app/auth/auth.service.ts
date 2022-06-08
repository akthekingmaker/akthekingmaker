import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthPayloadResponse{
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn:string,
  localId:string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null!);
  tokenExpirationTimeout: any;

  constructor(private http: HttpClient, private router: Router) { }

  

  Signup(email :string, password: string){
    return this.http.post<AuthPayloadResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBAjwJ2xsQnSkCmXjW6fOToXQExyO7xB1E",
    {
        email: email,
        password: password,
        returnSecureToken: true
    })
    .pipe(catchError(this.handleError),
    tap(resData => {
      this.handleAuthentication(resData.email,resData.localId,resData.idToken, +resData.expiresIn);
    }));
  }

  Login(email :string, password: string){
    return this.http.post<AuthPayloadResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBAjwJ2xsQnSkCmXjW6fOToXQExyO7xB1E',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError),
    tap(resData => {
      this.handleAuthentication(resData.email,resData.localId,resData.idToken, +resData.expiresIn);
    }));
  }

  autoLogin(){
    const userData:{
      email:string,
      id:string,
      _token: string,
      _tokenExpirationDate:string
    } = JSON.parse(localStorage.getItem('userData')!);

    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationduration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationduration);
    }
  }

  Logout(){
    this.user.next(null!);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimeout){
      clearTimeout(this.tokenExpirationTimeout);
    }
    this.tokenExpirationTimeout = null;
  }

  autoLogout(expirationduration: number){
    console.log(expirationduration);
    this.tokenExpirationTimeout = setTimeout(()=>{
      this.Logout();
    },expirationduration);
  }

  private handleAuthentication(email:string, userId: string, token: string, expiresIn: number){
    
    const expiresDate = new Date(new Date().getTime() + (expiresIn * 1000) );
    const user = new User(email,userId,token,expiresDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData',JSON.stringify(user));
  }

  private handleError (errorRes: HttpErrorResponse){
      let errorMes = 'An Unexpected error Occured';
      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMes);
      }
      switch(errorRes.error.error.message)
      {
        case 'EMAIL_EXISTS':
          errorMes = 'Email Id already exist please try different';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMes = 'Email id does not Exist';
          break;
        case 'INVALID_PASSWORD':
          errorMes = 'Invalid Password';
      }
      return throwError(errorMes);
  }

}
