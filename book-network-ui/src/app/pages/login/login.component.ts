import { Component } from '@angular/core';
import {AuthenticationRequest} from "../../services/models/authentication-request";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/services/authentication.service";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {TokenService} from "../../services/token/token.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMessage: Array<string> = [];
  public isLoggIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {
  }

  login() {
    this.tokenService.login = true;
    this.errorMessage = [];
    this.authService.authenticateUser({
        body: this.authRequest,
      }).subscribe({
      next: (res) => {

        this.tokenService.token = res.token as string;

        this.router.navigate(['books']);
      },
      error: err => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMessage = err.error.validationErrors;
        }
        else {
          this.errorMessage.push(err.error.error);
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }


}
