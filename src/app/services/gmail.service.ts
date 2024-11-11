import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { MessageContainerResponse, MessageResponse } from '../models/IMessage';
import { Formats } from '../models/enums';

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

  getMessages(userId = 'me', maxResults = 20) {
    return this.http.get<MessageContainerResponse>(
      `${this.API}/gmail/v1/users/${userId}/messages`,
      {
        headers: { Authorization: `Bearer ${this.authService.token}` },
        params: { maxResults },
      }
    );
  }

  getMessage(messageId: string, userId = 'me', format = Formats.FULL) {
    return this.http.get<MessageResponse>(
      `${this.API}/gmail/v1/users/${userId}/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${this.authService.token}` },
        params: { format },
      }
    );
  }
}
