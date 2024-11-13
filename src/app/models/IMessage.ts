export interface MessageContainerResponse {
  messages: { id: string; threadId: string }[];
  nextPageToken: string;
  resultSizeEstimate: number;
}

export interface MessageResponse {
  id: string;
  threadId: string;
  labelIds: [string];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: MessagePayload;
  sizeEstimate: number;
  raw: string;
}

export interface MessagePayload {
  body: { data: string; size: number };
  headers: { name: string; value: string }[];
  filename: string;
  mimeType: string;
  partId: string;
  parts: MessagePayload[];
}

export interface Message {
  id: string;
  body: string;
  subject: string;
  sender: string;
  snippet: string;
}
