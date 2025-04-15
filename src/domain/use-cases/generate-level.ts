import { OpenAiService } from "../../infrastructure/openai/openAiService";

export class GenerateLevel {
  private openAiService: OpenAiService;

  constructor() {
    this.openAiService = new OpenAiService();
  }

  async generate(): Promise<(boolean | null)[][]> {
    try {
      return await this.openAiService.generateLevel();
    } catch (error) {
      console.error('Failed to generate level:', error);
      // Return classic arrangement as fallback
      return [
        [null, null, true, true, true, null, null],
        [null, null, true, true, true, null, null],
        [true, true, true, true, true, true, true],
        [true, true, true, false, true, true, true],
        [true, true, true, true, true, true, true],
        [null, null, true, true, true, null, null],
        [null, null, true, true, true, null, null],
      ];
    }
  }
}
