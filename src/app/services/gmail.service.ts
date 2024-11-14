import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  IMessageContainerResponse,
  IMessageResponse,
} from '../models/IMessage';
import { Formats } from '../models/enums';
import { IThreadResponse, IThreadContainerResponse } from '../models/IThread';

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
    return this.http.get<IMessageContainerResponse>(
      `${this.API}/gmail/v1/users/${userId}/messages`,
      {
        headers: { Authorization: `Bearer ${this.authService.token}` },
        params: { maxResults },
      }
    );
  }

  getMessage(messageId: string, userId = 'me', format = Formats.FULL) {
    return this.http.get<IMessageResponse>(
      `${this.API}/gmail/v1/users/${userId}/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${this.authService.token}` },
        params: { format },
      }
    );
  }

  getThreads(userId = 'me', maxResults = 30, pageToken?: string) {
    const params: Record<string, any> = { maxResults };
    if (pageToken) params['pageToken'] = pageToken;
    return this.http.get<IThreadContainerResponse>(
      `${this.API}/gmail/v1/users/${userId}/threads`,
      {
        headers: { Authorization: `Bearer ${this.authService.token}` },
        params,
      }
    );
  }

  getThread(threadId: string, format = Formats.FULL, userId = 'me') {
    return this.http.get<IThreadResponse>(
      `${this.API}/gmail/v1/users/${userId}/threads/${threadId}`,
      {
        headers: { Authorization: `Bearer ${this.authService.token}` },
        params: { format },
      }
    );
  }
}
