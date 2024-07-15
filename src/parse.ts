const script = import.meta.env.VITE_FFMPEG_SCRIPT
const scriptURL = window.URL.createObjectURL(new Blob([script]))

export const parse = () => {
  const worker = new Worker(scriptURL)

  worker.onmessage = function (e) {
    const msg = e.data
    switch (msg.type) {
      case 'ready':
        worker.postMessage({ type: 'run', arguments: ['-version'] })
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
