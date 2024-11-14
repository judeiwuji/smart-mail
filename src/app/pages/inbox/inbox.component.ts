import { Component, OnInit } from '@angular/core';
import { GmailService } from '../../services/gmail.service';
import { combineLatest } from 'rxjs';
import {
  IMessage,
  IMessagePayload,
  IMessageResponse,
} from '../../models/IMessage';
import { Base64 } from 'js-base64';
import { InboxItemComponent } from '../../components/inbox-item/inbox-item.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { IThread, IThreadResponse } from '../../models/IThread';
import { IUser } from '../../models/IUser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [InboxItemComponent, FooterComponent, NgbTooltipModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit {
  messages: IMessage[] = [];
  threads: IThread[] = [];

  constructor(private readonly gmailService: GmailService) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  get hasMessages() {
    return this.messages.length > 0;
  }

  get hasThreads() {
    return this.threads.length > 0;
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

  normalizeMessage(message: IMessageResponse) {
    const parsed: IMessage = {
      id: message.id,
      body: '',
      sender: '',
      subject: '',
      snippet: this.trim(message.snippet ?? ''),
      threadId: message.threadId,
    };

    for (let meta of message.payload.headers) {
      if (meta.name === 'Subject') parsed.subject = meta.value;
      if (meta.name === 'From') parsed.sender = meta.value;
    }

    parsed.body = this.trim(this.partWalker([message.payload]).at(0) ?? '');
    return parsed;
  }

  normalizeThread(
    thread: IThreadResponse,
    message: IMessageResponse,
    messageCount: number
  ) {
    const messageSubject = message.payload.headers.find(
      ({ name }) => name.toLowerCase() === 'subject'
    );
    const messageSender = message.payload.headers.find(
      ({ name }) => name.toLowerCase() === 'from'
    );
    return {
      id: thread.id,
      messageCount,
      snippet: this.trim(thread.snippet),
      subject: messageSubject?.value ?? '',
      sender: this.normalizeUser(messageSender?.value ?? ''),
    } as IThread;
  }

  normalizeUser(value: string) {
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = value.match(emailPattern) ?? [];
    const email = (match.at(0) ?? '').trim();
    const name = (value.split(`<${email}>`).at(0) ?? '').trim();
    return { email, name } as IUser;
  }

  trim(value: string) {
    return value
      .replace(/(\\r\\n|\\n|\r\n|\n){2,}/g, '\n')
      .replace(/[ \s]{2,}/g, ' ')
      .trim();
  }

  partWalker(parts: IMessagePayload[]) {
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

  // loadMessages() {
  //   this.messages = [];
  //   this.gmailService.getMessages().subscribe((response) => {
  //     if (response) {
  //       const messages = response.messages.map((message) =>
  //         this.gmailService.getMessage(message.id)
  //       );

  //       combineLatest(messages).subscribe((allMessages) => {
  //         this.messages = allMessages.map((d) => this.normalizeMessage(d));
  //       });
  //     }
  //   });
  // }

  refresh() {
    this.threads = [];
    this.loadThreads();
  }

  loadThreads() {
    this.gmailService.getThreads().subscribe((response) => {
      if (response) {
        const threads = response.threads.map((thread) =>
          this.gmailService.getThread(thread.id)
        );

        combineLatest(threads).subscribe((allThreads) => {
          this.threads = response.threads.map((thread, index) => {
            const message = allThreads[index].messages[0];
            const messageCount = allThreads[index].messages.length;
            return this.normalizeThread(thread, message, messageCount);
          });
          console.log(this.threads);
        });
      }
    });
  }
}
