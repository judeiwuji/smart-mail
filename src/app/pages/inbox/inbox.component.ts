import { Component, OnInit } from '@angular/core';
import { GmailService } from '../../services/gmail.service';
import { combineLatest } from 'rxjs';
import {
  Message,
  MessagePayload,
  MessageResponse,
} from '../../models/IMessage';
import { Base64 } from 'js-base64';
import { InboxItemComponent } from '../../components/inbox-item/inbox-item.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [InboxItemComponent],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit {
  messages: Message[] = [];
  constructor(private readonly gmailService: GmailService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  get hasMessages() {
    return this.messages.length > 0;
  }

  htmlToPlainText(html: string) {
    let text = '';
    const container = document.createElement('div');
    container.innerHTML = html;
    container.querySelectorAll(':not(script):not(style)').forEach((element) => {
      text += (element as HTMLElement).innerText;
    });
    return text;
  }

  normalizeMessage(message: MessageResponse) {
    const parsed: Message = {
      body: '',
      sender: '',
      subject: '',
      snippet: this.trim(message.snippet ?? ''),
    };

    for (let meta of message.payload.headers) {
      if (meta.name === 'Subject') parsed.subject = meta.value;
      if (meta.name === 'From') parsed.sender = meta.value;
    }

    parsed.body = this.trim(this.partWalker([message.payload]).at(0) ?? '');
    return parsed;
  }

  trim(value: string) {
    return value
      .replace(/(\\r\\n|\\n|\r\n|\n){2,}/g, '\n')
      .replace(/[ \s]{2,}/g, ' ')
      .trim();
  }

  partWalker(parts: MessagePayload[]) {
    let listOfText: string[] = [];
    for (const part of parts) {
      if (part.body.data) {
        const decoded = Base64.decode(part.body.data);
        if (part.mimeType === 'text/plain') {
          listOfText.push(decoded);
        } else if (part.mimeType === 'text/html') {
          listOfText.push(this.htmlToPlainText(decoded));
        } else {
        }
      } else {
        if (part.parts) listOfText = this.partWalker(part.parts);
      }
    }
    return listOfText;
  }

  loadMessages() {
    this.messages = [];
    this.gmailService.getMessages().subscribe((response) => {
      if (response) {
        const messages = response.messages.map((message) =>
          this.gmailService.getMessage(message.id)
        );

        combineLatest(messages).subscribe((allMessages) => {
          this.messages = allMessages.map((d) => this.normalizeMessage(d));
        });
      }
    });
  }

  refresh() {
    this.messages = [];
    this.loadMessages();
  }
}
