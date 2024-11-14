import { Component, Input } from '@angular/core';
import { IMessage } from '../../shared/models/IMessage';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { Router } from '@angular/router';
import { IThread } from '../../shared/models/IThread';

@Component({
  selector: 'app-inbox-item',
  standalone: true,
  imports: [SafePipe],
  templateUrl: './inbox-item.component.html',
  styleUrl: './inbox-item.component.css',
})
export class InboxItemComponent {
  @Input() thread!: IThread;

  constructor(private readonly router: Router) {}

  get subject() {
    return this.thread.subject || 'No Subject';
  }

  get snippet() {
    return `${this.thread.sender.name}: ${this.thread.snippet}`;
  }

  onView() {
    this.router.navigateByUrl(`/inbox/conversation/${this.thread.id}`);
  }
}
