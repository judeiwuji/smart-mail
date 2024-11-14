import { Observable } from 'rxjs';

export interface IStorage {
  store: string;
  insert(value: unknown): unknown;
  insertMany(values: unknown[]): unknown;
  find(compare: (value: any) => boolean): unknown;
  findMany(compare: ((value: any) => boolean) | undefined): unknown;
  findById(id: string): unknown;
  destroy(id: string): unknown;
  clear(): unknown;
}
