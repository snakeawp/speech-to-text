import Recorder from './recorder';
import {startRecording, stopRecording} from '../@types/stt'
let microphoneStream: any; // stream from getUserMedia()
let rec:any = Recorder; // Recorder.js object
let input; // MediaStreamAudioSourceNode we'll be recording

// /**
//  *
//  * @param {{
//  * audioContext: AudioContext
//  * errHandler?: () => void
//  * onStreamLoad?: () => void
//  * }}
//  * @returns {Promise<MediaStream>}
//  */


export async function startRecording({
                                       audioContext,
                                       errHandler,
                                       onStreamLoad,
                                     }: startRecording): Promise<any> {
  try {
    const stream = await navigator?.mediaDevices.getUserMedia({ audio: true });

    if (onStreamLoad) {
      onStreamLoad();
    }

    /*  assign stream for later use  */
    microphoneStream = stream;

    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);

    rec = new Recorder(input);

    // start the recording process
    rec.record();

    return stream;
  } catch (err) {
    console.log(err);

    if (errHandler) {
      errHandler();
    }
  }
}

export function stopRecording() {
  // stop recorder.js recording
  rec.stop();

  // stop microphone access
  microphoneStream.getAudioTracks()[0].stop();

  rec.clear();
}
