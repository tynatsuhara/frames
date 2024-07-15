const script = import.meta.env.VITE_FFMPEG_SCRIPT
const scriptURL = window.URL.createObjectURL(new Blob([script]))

const version = () => {
  runInWorker({
    arguments: ['-version'],
  })
}

const getFrames = (buf: ArrayBuffer) => {
  runInWorker({
    MEMFS: [{ name: 'vid.mp4', data: new Uint8Array(buf) }],
    arguments: ['-i', 'vid.mp4', '-vf', 'select=eq(n,34)', '-vframes', '1', '-an', 'out.png'],
  })
}

const runInWorker = (args: object) => {
  const worker = new Worker(scriptURL)

  worker.onmessage = function (e) {
    const msg = e.data
    switch (msg.type) {
      case 'ready':
        worker.postMessage({
          type: 'run',
          ...args,
        })
        break
      case 'stdout':
        console.log(msg.data)
        break
      case 'stderr':
        console.log(msg.data)
        break
      case 'done':
        console.log(msg.data)
        break
    }
  }
}

export const ffmpeg = Object.freeze({
  version,
  getFrames,
})
