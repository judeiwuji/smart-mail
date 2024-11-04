import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) this.router.navigateByUrl('/');
  }

  authorize() {
    //@ts-ignore
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) {
        this.authService.token = token;
        this.router.navigateByUrl('/');
      }
    });
  }
}
