import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  API = 'https://gmail.googleapis.com';

  constructor(
    private readonly http: HttpClient,
    private authService: AuthService
  ) {}

  getInbox() {}

  getProfile(userId = 'me') {
    return this.http.get(`${this.API}/gmail/v1/users/${userId}/profile`, {
      headers: { Authorization: `Bearer ${this.authService.token}` },
    });
  }

  getMessages(userId = 'me') {
    return this.http.get(`${this.API}/gmail/v1/users/${userId}/messages`, {
      headers: { Authorization: `Bearer ${this.authService.token}` },
    });
  }
}
