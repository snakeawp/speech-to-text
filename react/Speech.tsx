import React, {useEffect, useState} from 'react';
import {useRuntime} from 'vtex.render-runtime'
import {useCssHandles} from 'vtex.css-handles';
import useSpeechToText from './Hooks';
import {ButtonPlain} from 'vtex.styleguide'
import Modal from 'react-modal';
// import './App.css';
import "./Public/styles.css"

// type GenericObject = Record<string, any>

const CSS_HANDLES = ['audioSearchContainer'];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


export default function Speech() {
  const {
    error,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: true,
    timeout: 1000,
    speechRecognitionProperties: {interimResults: true, lang: 'es-ES'}
  });

  const [line, setLine] = useState<string>('');
  const {navigate} = useRuntime();
  const search = encodeURIComponent(line);
  const [modalIsOpen, setIsOpen] = useState(false);
  const handles = useCssHandles(CSS_HANDLES);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const goToSearch = () => {
    navigate({
      page: 'store.search',
      params: {term: search},
      query: `_q=${line}&map=ft`,
      fallbackToWindowLocation: false,
    })
  }

  useEffect(() => {
    console.log('results', results);
    setLine(results[0] || '');
  }, [results])

  useEffect(() => {
    if(line.length > 0) {
      goToSearch()
    }
  },[line])


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
          <span style={{fontSize: '3rem'}}>🤷‍</span>
        </p>
      </div>
    );
  }

  return (
    <div
    >
      <button onClick={() => openModal()}> Open modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '100px auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '1rem'
          }}
        >
          <button onClick={closeModal}>close</button>
          <div>I am a modal</div>
          <ButtonPlain className={`${handles.audioSearchContainer} t-heading-2 c-muted-1 db tc`}
                       onClick={isRecording ? stopSpeechToText : startSpeechToText}
                       icon={true}
                       size="small"
          >
            <img data-recording={isRecording}
                 src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Font_Awesome_5_solid_microphone.svg" alt=""
                 style={{
                   borderRadius: '50%',
                   height: '20px',
                   width: '20px',
                   backgroundColor: 'red',
                   padding: '0.5rem'
                 }}
            />
          </ButtonPlain>
          <ButtonPlain onClick={() => goToSearch()}
                       size="small"
          >
            Go to search with value: {line}
          </ButtonPlain>
          <ButtonPlain onClick={() => {
            setResults([])
          }}>
            Clear
          </ButtonPlain>
        </div>
      </Modal>
    </div>
  )
    ;
}
