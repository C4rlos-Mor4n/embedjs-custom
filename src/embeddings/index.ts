import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { BaseEmbeddings } from "@llm-tools/embedjs";

export class LocalHuggingFaceEmbeddings implements BaseEmbeddings {
  private model: HuggingFaceTransformersEmbeddings;

  constructor(options?: {
    modelName?: string;
    maxConcurrency?: number;
    maxRetries?: number;
  }) {
    this.model = new HuggingFaceTransformersEmbeddings({
      modelName: options?.modelName ?? "Xenova/all-MiniLM-L6-v2",
      maxConcurrency: options?.maxConcurrency ?? 3,
      maxRetries: options?.maxRetries ?? 5,
    });
  }

  async getDimensions(): Promise<number> {
    return 384;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.model.embedDocuments(texts);
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.model.embedQuery(text);
  }
}
