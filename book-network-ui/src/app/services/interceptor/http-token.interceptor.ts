import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {TokenService} from "../token/token.service";


export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.token;
  const isLogIn: boolean = tokenService.login;

  if (isLogIn){
    tokenService.login = false;
    return next(req);
  }
  else {
    if (token) {
      const authRequest = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        })
      });
      return next(authRequest);
    }
    return next(req);
  }

};
