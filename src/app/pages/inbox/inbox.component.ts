import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    const loadTimer = setInterval(async () => {
      // @ts-ignore
      if (!gapi) return;

      clearInterval(loadTimer);

      await this.gapiLoaded();
      // @ts-ignore
      const response = await gapi.client.request({
        path: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
      });

      console.log(response);
    }, 1000);
  }

  gapiLoaded() {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      gapi.load('client', () => {
        // @ts-ignore
        gapi.client.setToken({ access_token: this.authService.token });
        // @ts-ignore
        gapi.client.setApiKey(environment.API_KEY);
        resolve();
      });
    });
  }
}
