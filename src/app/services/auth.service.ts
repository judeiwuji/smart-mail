import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';

  constructor() {}

  set token(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  get token() {
    return localStorage.getItem(this.tokenKey) ?? '';
  }

  get isAuthenticated() {
    return !!this.token;
  }

  logout() {
    localStorage.clear();
  }
}
