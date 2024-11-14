import { Injectable } from '@angular/core';
import { IStorage } from '../models/IStorage';
import { IMessage } from '../models/IMessage';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { filter, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService implements IStorage {
  constructor(private dbService: NgxIndexedDBService) {}
  store: string = 'messages';

  insert(value: IMessage) {
    return this.dbService.add(this.store, value);
  }

  insertMany(values: IMessage[]) {
    return this.dbService.bulkAdd(this.store, values);
  }

  find(compare: (value: any) => boolean) {
    return this.dbService.getAll<IMessage>(this.store).pipe(
      filter((message) => compare(message)),
      tap((messages) => messages.at(0))
    );
  }

  findMany(compare?: (value: IMessage) => boolean) {
    if (compare) {
      return this.dbService
        .getAll<IMessage>(this.store)
        .pipe(map((messages) => messages.filter(compare)));
    }
    return this.dbService.getAll<IMessage>(this.store);
  }

  findById(id: string) {
    return this.dbService.getByID<IMessage>(this.store, id);
  }

  destroy(id: string) {
    return this.dbService.deleteByKey(this.store, id);
  }

  clear() {
    return this.dbService.clear(this.store);
  }
}
