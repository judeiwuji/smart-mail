const GOOGLE_ORIGIN = "https://mail.google.com";

class SummarizeService {
  constructor() {}

  async create() {
    if (!self.ai || !self.ai.summarizer) {
      throw new Error("AI Summarization is not supported in this browser");
    }

    const canSummarize = await ai.summarizer.capabilities();
    console.log(canSummarize);
    if (canSummarize.available === "no") {
      throw new Error("AI Summarization is not supported");
    }

    const config = {
      format: "plain-text",
      length: "short",
      type: "headline",
      sharedContext: "an email",
    };

    const logger = (message, progress) => console.log(message);

    const summarizationSession = await ai.summarizer.create(config, logger);

    if (canSummarize.available === "after-download") {
      summarizationSession.addEventListener("downloadprogress", logger);
      await summarizationSession.ready;
    }
    return summarizationSession;
  }

  async summarize(text) {
    let summarizer = null;
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

class PromptService {
  config = {
    sliderTemperature: { value: 0 },
    sliderTopK: { value: 3, max: 0 },
    labelTopK: { textContent: 0 },
    labelTemperature: { textContent: 3 },
  };

  constructor() {}

  async initDefaults() {
    if (!("aiOriginTrial" in chrome)) {
      throw new Error(
        "Error: chrome.aiOriginTrial not supported in this browser"
      );
    }
    const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
    if (defaults.available !== "readily") {
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
    prompt,
    systemPrompt = "You are a helpful and friendly assistant."
  ) {
    try {
      if (!this.session) {
        await this.initDefaults();
        this.session = await chrome.aiOriginTrial.languageModel.create({
          systemPrompt,
          temperature: this.config.sliderTemperature.value,
          topK: this.config.sliderTopK.value,
        });
      }
      return this.session.prompt(prompt.substring(0, 4000));
    } catch (e) {
      console.log("Prompt failed");
      console.error(e);
      console.log("Prompt:", prompt);
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

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on mail.google.com
  if (url.origin === GOOGLE_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "index.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  let result = "";
  switch (request.mode) {
    case "summarize":
      // const summarizer = new SummarizeService();
      // result = await summarizer.summarize(request.text);
      const prompt = new PromptService();
      result = await prompt.run(request.text, "you are an email summarizer");
      sendResponse({ result });
      break;
  }
});
