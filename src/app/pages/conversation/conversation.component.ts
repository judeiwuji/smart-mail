import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageComponent } from '../../shared/components/message/message.component';
import { MessageService } from '../../shared/services/message.service';
import { Subject, takeUntil } from 'rxjs';
import { IMessage } from '../../shared/models/IMessage';
import { IThread } from '../../shared/models/IThread';
import { ThreadService } from '../../shared/services/thread.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css',
})
export class ConversationComponent implements OnInit, OnDestroy {
  public messages: IMessage[] = [];
  public thread?: IThread;

  private unsubscriber = new Subject<void>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private threadService: ThreadService
  ) {}

  ngOnInit(): void {
    const threadId = this.activatedRoute.snapshot.params['threadId'];

    this.messageService
      .findMany((message) => message.threadId === threadId)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((messages) => {
        this.messages = messages;
      });

    this.threadService
      .findById(threadId)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((thread) => (this.thread = thread));
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  get subject() {
    return this.thread ? this.thread.subject || 'No Subject' : 'No Subject';
  }

  goBack() {
    this.router.navigateByUrl('/inbox');
  }
}
