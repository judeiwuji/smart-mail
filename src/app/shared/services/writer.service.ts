import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WriterService {
  private writer!: ai.writer.AIWriter;

  constructor() {}

  private async create(): Promise<void> {
    if (!window.ai || !window.ai.writer) {
      throw new Error('AI Writer is not supported in this browser');
    }

    this.writer = await ai.writer.create({
      tone: 'formal',
    });
  }

  public async write(value: string): Promise<string> {
    if (!this.writer) await this.create();
    return this.writer.write(value);
  }
}
