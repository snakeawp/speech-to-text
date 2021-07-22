export interface UseSpeechToTextTypes {
  continuous?: boolean
  crossBrowser?: boolean
  onStartSpeaking?: () => any
  onStoppedSpeaking?: () => any
  speechRecognitionProperties?: SpeechRecognitionProperties
  timeout?: number
}
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
export interface SpeechRecognitionProperties {
  // continuous: do not pass continuous here, instead pass it as a param to the hook
  grammars?: SpeechGrammarList
  interimResults?: boolean
  lang?: string
  maxAlternatives?: number
}

export interface StartRecording {
  audioContext: any
  errHandler: any
  onStreamLoad?: any
}
export interface StopRecording {
  exportWAV: any
  wavCallback: any
}
