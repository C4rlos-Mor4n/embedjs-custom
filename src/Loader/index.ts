import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { get_available_languages } from "@suejon/youtube-subtitles";
import { YoutubeTranscript } from "youtube-transcript";
import { BaseLoader } from "@llm-tools/embedjs";
import { cleanString } from "~/util/strings";
import createDebugMessages from "debug";
import md5 from "md5";

export class YoutubeLoader extends BaseLoader<{ type: "YoutubeLoader" }> {
  private readonly debug = createDebugMessages("embedjs:loader:YoutubeLoader");
  private readonly videoIdOrUrl: string;
  private readonly videoIdOrUrlOriginal: string;
  private Lenguaje: string;

  constructor({
    videoIdOrUrl,
    lenguaje,
    chunkSize,
    chunkOverlap,
  }: {
    videoIdOrUrl: string;
    lenguaje?: string;
    chunkSize?: number;
    chunkOverlap?: number;
  }) {
    super(
      `YoutubeLoader_${videoIdOrUrl}`,
      { videoIdOrUrl },
      chunkSize ?? 2000,
      chunkOverlap ?? 0
    );
    this.videoIdOrUrl = md5(videoIdOrUrl);
    this.videoIdOrUrlOriginal = videoIdOrUrl;
    this.Lenguaje = lenguaje;
  }

  override async *getUnfilteredChunks() {
    const chunker = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });

    try {
      const languages = await get_available_languages(
        this.videoIdOrUrlOriginal
      );

      this.Lenguaje = languages.find((lang) => lang === this.Lenguaje);
      if (!this.Lenguaje) {
        this.debug(
          `Language ${this.Lenguaje} not available for video`,
          this.videoIdOrUrlOriginal
        );
        return;
      }

      const transcripts = await YoutubeTranscript.fetchTranscript(
        this.videoIdOrUrlOriginal,
        { lang: this.Lenguaje }
      );
      this.debug(
        `Transcripts (length ${transcripts.length}) obtained for video`,
        this.videoIdOrUrlOriginal
      );

      for (const transcript of transcripts) {
        for (const chunk of await chunker.splitText(
          cleanString(transcript.text)
        )) {
          yield {
            pageContent: chunk,
            metadata: {
              type: <"YoutubeLoader">"YoutubeLoader",
              source: this.videoIdOrUrlOriginal,
            },
          };
        }
      }
    } catch (e) {
      this.debug(
        "Could not get transcripts for video",
        this.videoIdOrUrlOriginal,
        e
      );
    }
  }
}
