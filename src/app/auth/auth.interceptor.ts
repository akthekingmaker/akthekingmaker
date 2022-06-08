import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable, take, exhaustMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user =>{
        if(!user){
          return next.handle(request);
        }
        const modifiedreq = request.clone({params: new HttpParams().set('auth',user.token!)})
        return next.handle(modifiedreq);
      })
    );  
    
  }
}
