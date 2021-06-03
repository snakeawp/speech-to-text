import React from 'react';

import useSpeechToText from './Hooks';

// import './App.css';
import "./Public/styles.css"

export default function Speech() {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: true,
    timeout: 10000,
    speechRecognitionProperties: { interimResults: true }
  });

  console.log('results', results);

  if (error) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '100px auto',
          textAlign: 'center'
        }}
      >
        <p>
          {error}
          <span style={{ fontSize: '3rem' }}>🤷‍</span>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '100px auto',
        textAlign: 'center'
      }}
    >
      {/*<h1>Recording: {isRecording.toString()}</h1>*/}
      <button className="button-recording" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {/*<span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>*/}
        <img data-recording={isRecording} src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Font_Awesome_5_solid_microphone.svg" alt="" />
      </button>
      <ul>
        {results.map((result: any, index: any) => (
          <li key={index}>{result}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
  );
}
