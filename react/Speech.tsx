import React, {useEffect, useState} from 'react';
import {useRuntime} from 'vtex.render-runtime'
import {useCssHandles} from 'vtex.css-handles';
import useSpeechToText from './Hooks';
import "./Public/styles.css"


const CSS_HANDLES = ['audioSearchContainer','audioSearchImg'];

interface Props {
  lang: string
  iconHeight: string
  iconWidth: string
  imgSrc: string
}
export default function Speech({lang,iconHeight,iconWidth,imgSrc}: Props) {

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: true,
    timeout: 1000,
    speechRecognitionProperties: {interimResults: true, lang: `${lang}`}
  });

  const [line, setLine] = useState<string>('');
  const {navigate} = useRuntime();
  const search = encodeURIComponent(line);
  const handles = useCssHandles(CSS_HANDLES);


  const goToSearch = () => {
    navigate({
      page: 'store.search',
      params: {term: search},
      query: `_q=${line}&map=ft`,
      fallbackToWindowLocation: false,
    })
  }

  useEffect(() => {
    setLine(results[0] || '');
  }, [results])

  useEffect(() => {
    if (line.length > 0) {
      goToSearch()
    }
  }, [line])

  return (
      <div className={`${handles.audioSearchContainer} t-heading-2 c-muted-1 db tc`}
                   onClick={isRecording ? stopSpeechToText : startSpeechToText}
      >
        <img data-recording={isRecording}
             src={`${imgSrc}`} alt="recorder-img"
             className={`${handles.audioSearchImg} ${isRecording ? handles.isRecordingState : ''} pa2 pointer` }
             style={{
               height: `${iconHeight}`,
               width:  `${iconWidth}`,
             }}
        />
      </div>
  );
}
