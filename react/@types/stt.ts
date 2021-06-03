import {GoogleCloudRecognitionConfig} from "../Hooks/GoogleCloudRecognitionConfig";

export interface UseSpeechToTextTypes {
  continuous?: boolean;
  crossBrowser?: boolean;
  googleApiKey?: string;
  googleCloudRecognitionConfig?: GoogleCloudRecognitionConfig;
  onStartSpeaking?: () => any;
  onStoppedSpeaking?: () => any;
  speechRecognitionProperties?: SpeechRecognitionProperties;
  timeout?: number;
  useOnlyGoogleCloud?: boolean;
}
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
export interface SpeechRecognitionProperties {
  // continuous: do not pass continuous here, instead pass it as a param to the hook
  grammars?: SpeechGrammarList;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

