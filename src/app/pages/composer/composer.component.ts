import { Component } from '@angular/core';

@Component({
  selector: 'app-composer',
  standalone: true,
  imports: [],
  templateUrl: './composer.component.html',
  styleUrl: './composer.component.css',
})
export class ComposerComponent {
  public goBack(): void {
    window.history.back();
  }
}
