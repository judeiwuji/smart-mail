import { Component, Input } from '@angular/core';
import { Message } from '../../models/IMessage';
import { SafePipe } from '../../pipes/safe.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox-item',
  standalone: true,
  imports: [SafePipe],
  templateUrl: './inbox-item.component.html',
  styleUrl: './inbox-item.component.css',
})
export class InboxItemComponent {
  @Input() message!: Message;

  constructor(private readonly router: Router) {}

  onView() {
    this.router.navigateByUrl(`/inbox/message/${this.message.id}`);
  }
}
