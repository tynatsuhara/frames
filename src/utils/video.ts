export type VideoMetadata = {
  duration: number
  videoHeight: number
  videoWidth: number
}

export const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const player = document.createElement('video')
    player.setAttribute('src', URL.createObjectURL(file))
    player.load()
    player.onerror = () => {
      reject('error loading video file')
    }
    player.onloadedmetadata = () => {
      const { duration, videoHeight, videoWidth } = player
      resolve({
        duration,
        videoHeight,
        videoWidth,
      })
    }
  })
}

export const renderFrames = (file: File, timestamps: number[], callback: (f: string) => void) => {
  const startTime = new Date().getTime()

  const player = document.createElement('video')
  player.setAttribute('src', URL.createObjectURL(file))
  player.load()
  player.onerror = () => alert('failed to process video')

  let frame = 0

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  player.onloadedmetadata = () => {
    canvas.width = player.videoWidth
    canvas.height = player.videoHeight
  }

  const queueNextFrame = () => {
    if (frame === timestamps.length) {
      const timeTaken = new Date().getTime() - startTime
      console.log(`rendered frames after ${timeTaken} milliseconds`)
      return
    }

    setTimeout(() => {
      player.onseeked = () => {
        ctx.drawImage(player, 0, 0, canvas.width, canvas.height)
        callback(ctx.canvas.toDataURL())
        frame++
        queueNextFrame()
      }

      const ts = timestamps[frame]
      try {
        player.currentTime = ts
      } catch (e) {
        // for some reason, this errors on the last frame, but also seems to work fine
      }
    })
  }

  queueNextFrame()
}
