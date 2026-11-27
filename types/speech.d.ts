interface SpeechResultLike {
  readonly [index: number]: { transcript: string };
}

interface SpeechEventLike {
  results: { [index: number]: SpeechResultLike };
}

interface SpeechRecognitionLike {
  lang: string;
  start: () => void;
  onresult: ((event: SpeechEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}
