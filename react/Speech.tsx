import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import useSpeechToText from './Hooks'
import './Public/styles.css'

const CSS_HANDLES = [
  'audioSearchContainer',
  'audioSearchImg',
  'audioSearchImgRecordingState',
]

interface Props {
  lang: string
  iconHeight: string
  iconWidth: string
  imgSrc: string
}

export default function Speech({
  lang = 'en-EN',
  iconHeight = '20px',
  iconWidth = '20px',
  imgSrc,
}: Props) {
  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    timeout: 1000,
    speechRecognitionProperties: { interimResults: true, lang: `${lang}` },
  })

  const [line, setLine] = useState<string>('')
  const { navigate } = useRuntime()
  const search = encodeURIComponent(line)
  const handles = useCssHandles(CSS_HANDLES)

  const goToSearch = () => {
    navigate({
      page: 'store.search',
      params: { term: search },
      query: `_q=${line}&map=ft`,
      fallbackToWindowLocation: false,
    })
  }

  const handleKeyPress = (ev) => {
    return ev
  }

  const handleRecording = () => {
    isRecording ? stopSpeechToText() : startSpeechToText()
  }

  useEffect(() => {
    setLine(results[results.length - 1] || '')
  }, [results])

  useEffect(() => {
    if (line.length > 0) {
      goToSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line])

  return (
    <div
      className={`${handles.audioSearchContainer} t-heading-2 c-muted-1 db tc`}
      onClick={() => handleRecording()}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
    >
      <img
        data-recording={isRecording}
        src={`${imgSrc}`}
        alt="recorder-img"
        className={`${handles.audioSearchImgRecordingState} ${
          isRecording ? handles.audioSearchImgRecordingState : ''
        } pa2 pointer`}
        style={{
          height: `${iconHeight}`,
          width: `${iconWidth}`,
        }}
      />
    </div>
  )
}
