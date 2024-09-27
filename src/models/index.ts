import { BaseModel } from "@llm-tools/embedjs";
import {
  Chunk,
  Message,
  ModelResponse,
} from "@llm-tools/embedjs/dist/global/types";
import { G4F } from "g4f";

export class G4FCustom extends BaseModel {
  private readonly modelName: string;
  private readonly g4fInstance: G4F;

  constructor({
    modelName,
    temperature,
  }: {
    modelName: string;
    temperature?: number;
  }) {
    super(temperature);
    this.modelName = modelName;
    this.g4fInstance = new G4F();
  }

  override async init(): Promise<void> {
    console.log(
      `Model ${this.modelName} initialized with temperature ${this.temperature}`
    );
  }

  public async runQuery(
    system: string,
    userQuery: string,
    supportingContext: Chunk[],
    pastConversations: Message[]
  ): Promise<ModelResponse> {
    const assistantInstructionMessage = {
      role: "system",
      content:
        "You are an assistant whose only function is to answer questions based on the provided CONTEXT. Do not invent answers. If you can't find the answer in the CONTEXT, simply say that you don't have enough information.",
    };

    const contextMessage = {
      role: "user",
      content: `CONTEXT: "${supportingContext
        .map((context) => context.pageContent)
        .join(" ")}"`,
    };

    const conversationMessages = pastConversations.map((conversation) => ({
      role: conversation.actor === "AI" ? "assistant" : "user",
      content: conversation.content,
    }));

    const userMessage = {
      role: "user",
      content: `Based on the CONTEXT provided, answer the following question: ${userQuery}`,
    };

    const messages = [
      assistantInstructionMessage,
      contextMessage,
      ...conversationMessages,
      userMessage,
    ];

    const options = {
      provider: this.g4fInstance.providers.GPT,
      model: this.modelName,
      debug: false,
    };

    try {
      console.log("Running query with g4f:", messages);
      const result = await this.g4fInstance.chatCompletion(messages, options);

      return {
        result: result,
        tokenUse: {
          inputTokens: messages.length,
          outputTokens: result.length,
        },
      };
    } catch (error) {
      console.error("Error running query with g4f:", error);
      throw new Error(
        `Error running query with model ${this.modelName}: ${error.message}`
      );
    }
  }
}
