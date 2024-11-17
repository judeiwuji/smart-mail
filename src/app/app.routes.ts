import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

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
    path: 'inbox/conversation/:threadId',
    loadComponent: () =>
      import('./pages/conversation/conversation.component').then(
        (m) => m.ConversationComponent
      ),
  },
  {
    canActivate: [authGuard],
    path: 'composer',
    loadComponent: () =>
      import('./pages/composer/composer.component').then(
        (m) => m.ComposerComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
