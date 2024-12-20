interface Window {
  ai: typeof ai;
}

declare namespace ai.summarizer {
  export interface AISummarizerCapabilities {
    available: 'no' | 'after-download' | 'readily';
  }
  export interface Config {
    type: 'key-points' | 'tl;dr' | 'teaser' | 'headline';
    format: 'markdown' | 'plain-text';
    length: 'short' | 'medium' | 'long';
    sharedContext: string;
  }
  export class AISummarizer {
    public format: string;
    public length: string;
    public sharedContext: string;
    public type: string;
    public ready: Promise<any>;

    public destroy(): void;
    public summarize(text: string): Promise<string>;
    public summarizeStreaming(text: string): ReadableStream;
    public addEventListener(
      event: string,
      cb: (message: string, progress: number) => void
    ): void;
  }
  export function capabilities(): Promise<AISummarizerCapabilities>;
  export function create(
    config: Config,
    cb?: (message: string, progress: number) => void
  ): Promise<AISummarizer>;
}

declare namespace ai.writer {
  export interface Config {
    tone: 'formal';
  }

  export class AIWriter {
    public write(value: string): Promise<string>;
  }

  export function create(config: Config): Promise<AIWriter>;
}
