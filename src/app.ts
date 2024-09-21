import { RAGApplicationBuilder, YoutubeSearchLoader } from "@llm-tools/embedjs";
import { G4FCustom } from "./models";
import { HNSWDb } from "./vectorBD";
import { LocalHuggingFaceEmbeddings } from "./embeddings";

const modelName = "gpt-3.5-turbo";

const llmApplication = await new RAGApplicationBuilder()
  .setEmbeddingModel(new LocalHuggingFaceEmbeddings())
  .setModel(
    new G4FCustom({
      modelName,
      temperature: 0.7,
    })
  )
  .setVectorDb(new HNSWDb())
  .build();

await llmApplication.addLoader(
  new YoutubeSearchLoader({ youtubeSearchString: "Tesla cars" })
);

console.log(await llmApplication.query("¿Me cuentas la historia de Tesla?"));
