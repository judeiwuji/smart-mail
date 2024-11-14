import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IStorage } from '../models/IStorage';
import { IThread } from '../models/IThread';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThreadService implements IStorage {
  store = 'threads';

  constructor(private dbService: NgxIndexedDBService) {}

  insert(value: IThread) {
    return this.dbService.add(this.store, value);
  }

  insertMany(values: IThread[]) {
    return this.dbService.bulkAdd(this.store, values);
  }

  findById(id: string) {
    return this.dbService.getByID<IThread>(this.store, id);
  }

  find(compare: (value: any) => boolean) {
    return this.dbService.getAll<IThread>(this.store).pipe(
      filter((thread) => compare(thread)),
      tap((threads) => threads.at(0))
    );
  }

  findMany(compare: ((value: any) => boolean) | undefined) {
    if (compare) {
      return this.dbService
        .getAll<IThread>(this.store)
        .pipe(filter((thread) => compare(thread)));
    }
    return this.dbService.getAll<IThread>(this.store);
  }

  destroy(id: string) {
    return this.dbService.deleteByKey(this.store, id);
  }

  clear() {
    this.dbService.clear(this.store);
  }
}
