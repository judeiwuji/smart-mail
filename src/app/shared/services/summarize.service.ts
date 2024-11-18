import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SummarizeService {
  constructor() {}

  private async create(): Promise<ai.summarizer.AISummarizer> {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error('AI Summarization is not supported in this browser');
    }

    const canSummarize = await ai.summarizer.capabilities();

    if (canSummarize.available === 'no') {
      throw new Error('AI Summarization is not supported');
    }

    const config: ai.summarizer.Config = {
      format: 'plain-text',
      length: 'short',
      type: 'headline',
      sharedContext: 'an email',
    };

    const logger = (message: string, progress: number) => console.log(message);

    const summarizationSession = await ai.summarizer.create(config, logger);

    if (canSummarize.available === 'after-download') {
      summarizationSession.addEventListener('downloadprogress', logger);
      await summarizationSession.ready;
    }
    return summarizationSession;
  }

  async summarize(text: string) {
    let summarizer: ai.summarizer.AISummarizer | null = null;
    try {
      summarizer = await this.create();
      console.log(summarizer);
      const result = await summarizer.summarize(text);
      summarizer.destroy();
      return result;
    } catch (error) {
      if (summarizer) summarizer.destroy();
      throw error;
    }
  }
}
