import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/authorize/authorize.component').then(
        (m) => m.AuthorizeComponent
      ),
  },
  {
    canActivate: [authGuard],
    path: 'inbox',
    loadComponent: () =>
      import('./pages/inbox/inbox.component').then((m) => m.InboxComponent),
  },
  {
    canActivate: [authGuard],
    path: 'inbox/message/:id',
    loadComponent: () =>
      import('./pages/message/message.component').then(
        (m) => m.MessageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
