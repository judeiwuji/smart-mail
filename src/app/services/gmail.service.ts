import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  API = 'https://gmail.googleapis.com';

  constructor(http: HttpClient) {}
}
