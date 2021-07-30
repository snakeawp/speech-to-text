import { useState, useEffect, useRef } from 'react'
import Hark from 'hark'

// eslint-disable-next-line import/order
import { startRecording, stopRecording } from './recorderHelpers'

// https://cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionConfig
import { UseSpeechToTextTypes } from '../@types/stt'
import { is_constructor } from '../utils'

const AudioContext = window.AudioContext || (window as any).webkitAudioContext

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition

let recognition: SpeechRecognition | null

// Chromium browsers will have the SpeechRecognition method
// but do not implement the functionality due to google wanting 💰
// this covers new Edge and line 22 covers Brave, the two most popular non-chrome chromium browsers
if (is_constructor(SpeechRecognition)) {
  recognition = new SpeechRecognition()
}

export default function useSpeechToText({
  continuous,
  crossBrowser,
  onStartSpeaking,
  onStoppedSpeaking,
  speechRecognitionProperties,
  timeout,
}: UseSpeechToTextTypes) {
  const [isRecording, setIsRecording] = useState(false)

  const audioContextRef = useRef<AudioContext>()

  const [results, setResults] = useState<string[]>([])
  const [interimResult, setInterimResult] = useState<string | undefined>()
  const [error, setError] = useState('')

  const timeoutId = useRef<number>()
  const mediaStream = useRef<MediaStream>()

  useEffect(() => {
    if (!crossBrowser && !recognition) {
      setError('Speech Recognition API is only available on Chrome')
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError('getUserMedia is not supported on this device/browser :(')
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
  }, [crossBrowser])

  // Chrome Speech Recognition API:
  // Only supported on Chrome browsers
  const chromeSpeechRecognition = () => {
    if (recognition) {
      // Continuous recording after stopped speaking event
      if (continuous) recognition.continuous = false

      const { grammars, interimResults, lang, maxAlternatives } =
        speechRecognitionProperties || {}

      if (grammars) recognition.grammars = grammars
      if (lang) recognition.lang = lang

      recognition.interimResults = interimResults || false
      recognition.maxAlternatives = maxAlternatives || 1

      // start recognition
      recognition.start()

      // speech successfully translated into text
      recognition.onresult = (e) => {
        const result = e.results[e.results.length - 1]
        const { transcript } = result[0]

        // Allows for realtime speech result UI feedback
        if (interimResults) {
          if (result.isFinal) {
            setInterimResult(undefined)
            setResults((prevResults) => [...prevResults, transcript])
          } else {
            let concatTranscripts = ''

            // If continuous: e.results will include previous speech results: need to start loop at the current event resultIndex for proper concatenation
            for (let i = e.resultIndex; i < e.results.length; i++) {
              concatTranscripts += e.results[i][0].transcript
            }

            setInterimResult(concatTranscripts)
          }
        } else {
          setResults((prevResults) => [...prevResults, transcript])
        }
      }

      recognition.onaudiostart = () => setIsRecording(true)

      // Audio stopped recording or timed out.
      // Chrome speech auto times-out if no speech after a while
      recognition.onend = () => {
        setIsRecording(false)
      }
    }
  }

  const stopSpeechToText = () => {
    if (recognition) {
      recognition.stop()
    }
  }

  const handleRecordingTimeout = () => {
    timeoutId.current = window.setTimeout(() => {
      setIsRecording(false)
      mediaStream.current?.getAudioTracks()[0].stop()
      stopRecording()
    }, timeout)
  }

  const startSpeechToText = async () => {
    if (recognition) {
      chromeSpeechRecognition()

      return
    }

    if (!crossBrowser) {
      return
    }

    // Resume audio context due to google auto play policy
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current?.resume()
    }

    const stream = await startRecording({
      errHandler: () => setError('Microphone permission was denied'),
      audioContext: audioContextRef.current as AudioContext,
    })

    // Stop recording if timeout
    if (timeout) {
      handleRecordingTimeout()
    }

    // stop previous mediaStream track if exists
    if (mediaStream.current) {
      mediaStream.current.getAudioTracks()[0].stop()
    }

    // Clones stream to fix hark bug on Safari
    mediaStream.current = stream.clone()

    const speechEvents = Hark(mediaStream.current, {
      audioContext: audioContextRef.current as AudioContext,
    })

    speechEvents.on('speaking', () => {
      if (onStartSpeaking) onStartSpeaking()

      // Clear previous recording timeout on every speech event
      clearTimeout(timeoutId.current)
    })

    speechEvents.on('stopped_speaking', () => {
      if (onStoppedSpeaking) onStoppedSpeaking()

      setIsRecording(false)
      mediaStream.current?.getAudioTracks()[0].stop()

      // Stops current recording and sends audio string to google cloud.
      // recording will start again after google cloud api
      // call if `continuous` prop is true. Until the api result
      // returns, technically the microphone is not being captured again
      stopRecording()
    })

    setIsRecording(true)
  }

  return {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  }
}
