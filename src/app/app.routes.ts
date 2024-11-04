import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () =>
      import('./pages/inbox/inbox.component').then((m) => m.InboxComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
