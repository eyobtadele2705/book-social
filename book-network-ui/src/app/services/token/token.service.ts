import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public isLogIn: boolean = false;
  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token(){
    return localStorage.getItem('token') as string;
  }

  set login(flag: boolean){
    this.isLogIn = flag;
  }

  get login(): boolean {
    return this.isLogIn;
  }

  isTokenInvalid() {
    return !this.isTokenValid();
  }

  private isTokenValid() {
    const token = this.token;
    if (!token){
      return false;
    }
    // decode token
    const jwtHelper = new JwtHelperService();

    //check expiry date
    const  isTokenExpired = jwtHelper.isTokenExpired(token);

    if(isTokenExpired) {
      localStorage.clear();
    }
    return true;
  }
}
