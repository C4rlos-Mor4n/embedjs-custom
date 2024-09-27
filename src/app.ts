import { RAGApplicationBuilder } from "@llm-tools/embedjs";
import { G4FCustom } from "./models";
import { HNSWDb } from "./vectorBD";
import { LocalHuggingFaceEmbeddings } from "./embeddings";
import { YoutubeLoader } from "./Loader";

const modelName = "gpt-3.5-turbo";

const llmApplication = await new RAGApplicationBuilder()
  .setEmbeddingModel(new LocalHuggingFaceEmbeddings())
  .setModel(
    new G4FCustom({
      modelName,
      temperature: 0.7,
    })
  )
  .setSearchResultCount(150)
  .setVectorDb(new HNSWDb())
  .build();

const a = await llmApplication.addLoader(
  new YoutubeLoader({
    videoIdOrUrl: "xYjKJAvTuWs",
    lenguaje: "es",
  })
);

console.log(a);

console.log(
  await llmApplication.query("Has me un resumen del lo mas importante ")
);
