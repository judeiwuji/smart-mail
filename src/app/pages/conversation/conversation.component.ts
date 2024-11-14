import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { MessageComponent } from '../../components/message/message.component';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [FooterComponent, MessageComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css',
})
export class ConversationComponent {
  public messages = new Array(10).fill(0);

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/inbox');
  }
}
