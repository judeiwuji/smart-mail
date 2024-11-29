import { Component, Input, OnInit } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { IMessage } from '../../models/IMessage';
import { IUser } from '../../models/IUser';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { LinkifyPipe } from '../../pipes/linkify.pipe';
import { SummarizeService } from '../../services/summarize.service';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AvatarComponent, NgClass, LinkifyPipe, DatePipe, TitleCasePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  @Input({ required: true }) message!: IMessage;
  public user: IUser = { name: 'Jude Iwuji', email: 'judeiwuji@gmail.com' };
  public processing = false;
  public summary?: string;
  public showSummary = false;

  constructor(
    private summarizeService: SummarizeService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.promptService.reset();
  }

  get isCurrent() {
    return this.message.sender.email === this.user.email;
  }

  get time() {
    return this.message.timestamp;
  }

  get summarizeLabel() {
    return this.showSummary ? 'Hide Summary' : 'Summarize';
  }

  summarize() {
    if (this.summary) {
      this.showSummary = !this.showSummary;
      return;
    }

    if (this.processing) return;
    this.processing = true;
    this.summarizeService
      .summarize(this.message.body)
      .then((result) => {
        this.summary = result;
        this.showSummary = true;
      })
      .catch((reason) => console.log(reason))
      .finally(() => (this.processing = false));
  }
}
