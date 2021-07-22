import InlineWorker from 'inline-worker'

export class Recorder {
  constructor(source, cfg) {
    this.config = {
      bufferLen: 4096,
      numChannels: 1,
      mimeType: 'audio/wav',
      ...cfg,
    }
    this.recording = false
    this.callbacks = {
      getBuffer: [],
    }
    this.context = source.context
    this.node = (
      this.context.createScriptProcessor || this.context.createJavaScriptNode
    ).call(
      this.context,
      this.config.bufferLen,
      this.config.numChannels,
      this.config.numChannels
    )

    this.node.onaudioprocess = (e) => {
      if (!this.recording) return

      const buffer = []

      for (let channel = 0; channel < this.config.numChannels; channel++) {
        buffer.push(e.inputBuffer.getChannelData(channel))
      }

      this.worker.postMessage({
        command: 'record',
        buffer,
      })
    }

    source.connect(this.node)
    this.node.connect(this.context.destination) // this should not be necessary

    const self = {}

    this.worker = new InlineWorker(function () {
      let recLength = 0
      let recBuffers = []
      let sampleRate
      let numChannels

      this.onmessage = function (e) {
        // eslint-disable-next-line default-case
        switch (e.data.command) {
          case 'init':
            init(e.data.config)
            break

          case 'record':
            record(e.data.buffer)
            break

          case 'getBuffer':
            getBuffer()
            break

          case 'clear':
            clear()
            break
        }
      }

      let newSampleRate

      function init(config) {
        sampleRate = config.sampleRate
        numChannels = config.numChannels
        initBuffers()

        if (sampleRate > 48000) {
          newSampleRate = 48000
        } else {
          // eslint-disable-next-line no-unused-vars
          newSampleRate = sampleRate
        }
      }

      function record(inputBuffer) {
        for (let channel = 0; channel < numChannels; channel++) {
          recBuffers[channel].push(inputBuffer[channel])
        }

        recLength += inputBuffer[0].length
      }

      function getBuffer() {
        const buffers = []

        for (let channel = 0; channel < numChannels; channel++) {
          buffers.push(mergeBuffers(recBuffers[channel], recLength))
        }

        this.postMessage({ command: 'getBuffer', data: buffers })
      }

      function clear() {
        recLength = 0
        recBuffers = []
        initBuffers()
      }

      function initBuffers() {
        for (let channel = 0; channel < numChannels; channel++) {
          recBuffers[channel] = []
        }
      }

      // eslint-disable-next-line no-shadow
      function mergeBuffers(recBuffers, recLength) {
        const result = new Float32Array(recLength)
        let offset = 0

        for (let i = 0; i < recBuffers.length; i++) {
          result.set(recBuffers[i], offset)
          offset += recBuffers[i].length
        }

        return result
      }
    }, self)

    this.worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: this.config.numChannels,
      },
    })

    this.worker.onmessage = (e) => {
      const cb = this.callbacks[e.data.command].pop()

      if (typeof cb === 'function') {
        cb(e.data.data)
      }
    }
  }

  record() {
    this.recording = true
  }

  stop() {
    this.recording = false
  }

  clear() {
    this.worker.postMessage({ command: 'clear' })
  }

  getBuffer(cb) {
    cb = cb || this.config.callback
    if (!cb) throw new Error('Callback not set')

    this.callbacks.getBuffer.push(cb)

    this.worker.postMessage({ command: 'getBuffer' })
  }
}

export default Recorder
