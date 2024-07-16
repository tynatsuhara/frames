export const getDurationSeconds = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const player = document.createElement('video')
    player.setAttribute('src', URL.createObjectURL(file))
    player.load()
    player.onerror = () => {
      reject('error loading video file')
    }

    player.onloadedmetadata = () => {
      resolve(player.duration)
    }
  })
}

export const getFrames = (file: File, timestamps: number[]): Promise<string[]> => {
  return new Promise((resolve) => {
    const startTime = new Date().getTime()

    const player = document.createElement('video')
    player.setAttribute('src', URL.createObjectURL(file))
    player.load()
    player.onerror = () => alert('failed to process video')

    const frames: string[] = [] // an array of data urls

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    player.onloadedmetadata = () => {
      canvas.width = player.videoWidth
      canvas.height = player.videoHeight
    }

    const queueNextFrame = () => {
      if (frames.length === timestamps.length) {
        const timeTaken = new Date().getTime() - startTime
        console.log(`rendered frames after ${timeTaken} milliseconds`)
        resolve(frames)
      }

      setTimeout(() => {
        player.onseeked = () => {
          ctx.drawImage(player, 0, 0, canvas.width, canvas.height)
          frames.push(ctx.canvas.toDataURL())
          queueNextFrame()
        }

        const ts = timestamps[frames.length]
        try {
          player.currentTime = ts
        } catch (e) {
          // for some reason, this errors on the last frame, but also seems to work fine
        }
      })
    }

    queueNextFrame()
  })
}
