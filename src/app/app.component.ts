import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'smart-mail';

  ngOnInit(): void {
    //@ts-ignore
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log(token);
    });
  }
}
