import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SummarizeService {
  constructor() {}

  private async create(): Promise<ai.summarizer.AISummarizer> {
    if (!window.ai && !ai.summarizer) {
      throw new Error('AI not available on your device');
    }
    return new Promise(async (resolve, reject) => {
      const canSummarize = await ai.summarizer.capabilities();
      if (canSummarize && canSummarize.available !== 'no') {
        if (canSummarize.available === 'readily') {
          resolve(await ai.summarizer.create());
        } else {
          const summarizer = await ai.summarizer.create();
          summarizer.addEventListener('downloadprogress', async (e) => {
            console.log(e.loaded, e.total);
            if (e.loaded === e.total) {
              await summarizer.ready;
              resolve(summarizer);
            }
          });
        }
      } else {
        reject('AI not available on your device');
      }
    });
  }

  async summarize(text: string) {
    const summarizer = await this.create();
    const result = await summarizer.summarize(text);
    summarizer.destroy();
    return result;
  }
}
