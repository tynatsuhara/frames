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

export const getFrame = (file: File, timestamp = 0): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const player = document.createElement('video')
    player.setAttribute('src', URL.createObjectURL(file))
    player.load()
    player.onerror = () => {
      reject('error loading video file')
    }

    player.onloadedmetadata = () => {
      // seek to user defined timestamp (in seconds) if possible
      if (player.duration < timestamp) {
        reject('error loading video')
        return
      }

      // extract video thumbnail once seeking is complete
      player.onseeked = () => {
        console.log('video is now paused at %ss.', timestamp)
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas')
        canvas.width = player.videoWidth
        canvas.height = player.videoHeight
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(player, 0, 0, canvas.width, canvas.height)
        // return the canvas image as a blob
        ctx.canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          'image/jpeg',
          1 /* quality */
        )
      }

      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        player.currentTime = timestamp
      }, 200)
    }
  })
}
