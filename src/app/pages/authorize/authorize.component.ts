import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorize',
  standalone: true,
  imports: [],
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.css',
})
export class AuthorizeComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    //@ts-ignore
    chrome.identity.getAuthToken({}, (token) => {
      if (token) {
        this.authService.token = token;
        this.router.navigateByUrl('/inbox');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
