import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {AuthenticationService} from "../../services/services/authentication.service";
import {CodeInputModule} from "angular-code-input";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CodeInputModule,
    CommonModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  message: string = '';
  isOkay: boolean = true;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = "Your account has been activated successfully.\nNow you can proceed to login.";
        this.submitted = true;
        this.isOkay = true;
      },
      error: (err) => {
        this.message = "Your token is either expired or invalid.";
        this.submitted = true;
        this.isOkay = false;
      }
    })
  }
}
