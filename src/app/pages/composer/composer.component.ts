import { Component, ViewEncapsulation } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { WriterService } from '../../shared/services/writer.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-composer',
  standalone: true,
  imports: [NgbPopoverModule, ReactiveFormsModule],
  templateUrl: './composer.component.html',
  styleUrl: './composer.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ComposerComponent {
  public composerForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required, Validators.email]),
    body: new FormControl('', [Validators.required]),
  });
  public processing = false;

  constructor(private writerService: WriterService) {}

  public goBack(): void {
    window.history.back();
  }

  public get fc() {
    return this.composerForm.controls;
  }

  compose() {
    if (this.processing) return;
    if (!this.fc.subject.value) {
      this.fc.subject.markAsTouched();
      return;
    }

    this.processing = true;
    this.writerService
      .write(this.fc.subject.value)
      .then((result) => {
        console.log(result);
        this.composerForm.patchValue({ body: result });
      })
      .finally(() => (this.processing = false));
  }
}
