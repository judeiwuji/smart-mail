import { Component, OnInit } from '@angular/core';
import { GmailService } from '../../shared/services/gmail.service';
import { combineLatest } from 'rxjs';
import {
  IMessage,
  IMessagePayload,
  IMessageResponse,
} from '../../shared/models/IMessage';
import { Base64 } from 'js-base64';
import { InboxItemComponent } from '../../components/inbox-item/inbox-item.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { IThread, IThreadResponse } from '../../shared/models/IThread';
import { IUser } from '../../shared/models/IUser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ThreadService } from '../../shared/services/thread.service';
import { MessageService } from '../../shared/services/message.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private readonly authService: AuthService,
    private readonly gmailService: GmailService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly threadService: ThreadService
  ) {}

  ngOnInit(): void {
    this.threadService.findMany().subscribe({
      next: (threads) => {
        if (threads.length === 0) {
          this.loadThreadsAndMessages();
          return;
        }

        this.threads = threads;
      },
      error: (error) => console.log(error),
    });
  }

  get hasMessages() {
    return this.messages.length > 0;
  }

  get hasThreads() {
    return this.threads.length > 0;
  }

  htmlToPlainText(html: string) {
    let text = '';
    try {
      const container = document.createElement('div');
      container.innerHTML = html;
      container
        .querySelectorAll(':not(script):not(style)')
        .forEach((element) => {
          text += (element as HTMLElement).innerText;
        });
    } catch (error) {
      console.log(error);
    }
    return text;
  }

  findFromHeader(headers: { value: string; name: string }[], key: string) {
    return headers.find(({ name }) => name.toLowerCase() === key)?.value ?? '';
  }

  normalizeMessage(message: IMessageResponse) {
    const parsed: IMessage = {
      id: message.id,
      body: '',
      sender: { email: '', name: '' },
      subject: '',
      snippet: this.trim(message.snippet ?? ''),
      threadId: message.threadId,
      timestamp: Number(message.internalDate),
    };
    parsed.subject = this.findFromHeader(message.payload.headers, 'subject');
    parsed.sender = this.normalizeUser(
      this.findFromHeader(message.payload.headers, 'from')
    );
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

  refresh() {
    this.threads = [];
    combineLatest([
      this.threadService.clear(),
      this.messageService.clear(),
    ]).subscribe(() => {
      this.loadThreadsAndMessages();
    });
  }

  async loadThreadsAndMessages() {
    //@ts-ignore
    const result = await chrome.identity.getAuthToken({});
    this.authService.token = result.token;
    if (!this.authService) {
      this.router.navigateByUrl('/login');
      return;
    }

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

          this.threadService.insertMany(this.threads);
          const messages = allThreads
            .map((thread) => thread.messages)
            .flat(1)
            .map((d) => this.normalizeMessage(d));

          this.messageService.insertMany(messages);
        });
      }
    });
  }
}
