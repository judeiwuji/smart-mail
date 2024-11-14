import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

const dbConfig: DBConfig = {
  name: 'InboxStore',
  version: 1,
  objectStoresMeta: [
    {
      store: 'threads',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'snippet', keypath: 'snippet', options: { unique: false } },
        { name: 'subject', keypath: 'subject', options: { unique: false } },
        {
          name: 'messageCount',
          keypath: 'messageCount',
          options: { unique: false },
        },
        {
          name: 'sender',
          keypath: 'sender',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'messages',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        {
          name: 'threadId',
          keypath: 'threadId',
          options: { unique: false },
        },
        { name: 'body', keypath: 'body', options: { unique: false } },
        { name: 'subject', keypath: 'subject', options: { unique: false } },
        {
          name: 'sender',
          keypath: 'sender',
          options: { unique: false },
        },
        { name: 'snippet', keypath: 'snippet', options: { unique: false } },
        { name: 'timestamp', keypath: 'timestamp', options: { unique: false } },
      ],
    },
  ],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
  ],
};
