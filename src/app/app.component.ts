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
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  ngOnInit(): void {
    setInterval(() => {
      this.count.update((value) => value + 1);
    });
  }
}
