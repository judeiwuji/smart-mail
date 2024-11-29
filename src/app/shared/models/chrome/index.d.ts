/**
 * aiOriginTrial - Use to try out Gemini on device
 */
namespace chrome.aiOriginTrial.languageModel {
  export interface AICapabilities {
    defaultTemperature: number;
    defaultTopK: number;
    available: 'no' | 'after-download' | 'readily';
    maxTopK: number;
  }
  export interface AIPromptParam{
    
  }
  export class AIPromptSession {
    prompt(text: string): string;
  }
  export declare function create(params: any): Promise<AIPromptSession>;
  export declare function capabilities(): AICapabilities;
}
