import { IUser } from './IUser';

export interface IMessageContainerResponse {
  messages: { id: string; threadId: string }[];
  nextPageToken: string;
  resultSizeEstimate: number;
}

export interface IMessageResponse {
  id: string;
  threadId: string;
  labelIds: [string];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: IMessagePayload;
  sizeEstimate: number;
  raw: string;
}

export interface IMessagePayload {
  body: { data: string; size: number };
  headers: { name: string; value: string }[];
  filename: string;
  mimeType: string;
  partId: string;
  parts: IMessagePayload[];
}

export interface IMessage {
  id: string;
  threadId: string;
  body: string;
  subject: string;
  sender: IUser;
  snippet: string;
  timestamp: number;
}
