import { RAGApplicationBuilder, YoutubeLoader } from "@llm-tools/embedjs";
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
  .setSearchResultCount(30)
  .setVectorDb(new HNSWDb())
  .build();

const a = await llmApplication.addLoader(
  new YoutubeLoader({
    videoIdOrUrl: "HEH3qLofMaU",
  })
);
console.log(a);

// await llmApplication.addLoader(
//   new WebLoader({
//     urlOrContent: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
//   })
// );

console.log(await llmApplication.query("Has me un resumen en español"));
