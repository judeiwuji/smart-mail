import { IMessageResponse } from './IMessage';
import { IUser } from './IUser';

export interface IThreadContainerResponse {
  threads: IThreadResponse[];
  nextPageToken: string;
  resultSizeEstimate: number;
}

export interface IThreadResponse {
  id: string;
  snippet: string;
  historyId: string;
  messages: IMessageResponse[];
}

export interface IThread {
  id: string;
  snippet: string;
  subject: string;
  messageCount: number;
  sender: IUser;
}
