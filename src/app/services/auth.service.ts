import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token?: string;

  constructor() {}

  get isAuthenticated() {
    return !!this.token;
  }

  async logout() {
    //@ts-ignore
    await chrome.identity.clearAllCachedAuthTokens();
  }
}
