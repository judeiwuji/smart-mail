import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private session!: any;
  private config = {
    sliderTemperature: { value: 0 },
    sliderTopK: { value: 3, max: 0 },
    labelTopK: { textContent: 0 },
    labelTemperature: { textContent: 3 },
  };

  constructor() {}

  private async initDefaults() {
    if (!('aiOriginTrial' in chrome)) {
      throw new Error(
        'Error: chrome.aiOriginTrial not supported in this browser'
      );
    }
    const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
    if (defaults.available !== 'readily') {
      throw new Error(
        `Model not yet available (current state: "${defaults.available}")`
      );
    }
    this.config.sliderTemperature.value = defaults.defaultTemperature;
    // Pending https://issues.chromium.org/issues/367771112.
    // sliderTemperature.max = defaults.maxTemperature;
    if (defaults.defaultTopK > 3) {
      // limit default topK to 3
      this.config.sliderTopK.value = 3;
      this.config.labelTopK.textContent = 3;
    } else {
      this.config.sliderTopK.value = defaults.defaultTopK;
      this.config.labelTopK.textContent = defaults.defaultTopK;
    }
    this.config.sliderTopK.max = defaults.maxTopK;
    this.config.labelTemperature.textContent = defaults.defaultTemperature;
  }

  async run(
    prompt: string,
    systemPrompt = 'You are a helpful and friendly assistant.'
  ) {
    try {
      if (!this.session) {
        this.initDefaults();
        this.session = await chrome.aiOriginTrial.languageModel.create({
          systemPrompt,
          temperature: this.config.sliderTemperature.value,
          topK: this.config.sliderTopK.value,
        });
      }
      return this.session.prompt(prompt.substring(0, 4000)) as string;
    } catch (e) {
      console.log('Prompt failed');
      console.error(e);
      console.log('Prompt:', prompt);
      // Reset session
      this.reset();
      throw e;
    }
  }

  async reset() {
    if (this.session) {
      this.session.destroy();
    }
    this.session = null;
  }
}
