import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { GmailService } from '../../services/gmail.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly gmailService: GmailService
  ) {}

  ngOnInit(): void {
    // this.init();
    this.gmailService.getMessages().subscribe((response) => {
      console.log(response);
    });
  }
}
