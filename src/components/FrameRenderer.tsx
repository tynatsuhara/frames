import { Component, Show, createEffect, createSignal } from 'solid-js'
import { getDurationSeconds, getFrame } from '../utils/video'

const FRAMES = 10
const TRIM_START_SECONDS = 5
const TRIM_END_SECONDS = 5

export const FrameRenderer: Component<{ file: File | undefined }> = (props) => {
  const [frames, setFrames] = createSignal<string[]>([]) // base64 image strings
  const [duration, setDuration] = createSignal<number>()

  createEffect(() => {
    if (props.file) {
      const startTime = new Date().getTime()
      setFrames([])

      getDurationSeconds(props.file).then((seconds) => {
        setDuration(seconds)

        const segmentLength = (seconds - TRIM_START_SECONDS - TRIM_END_SECONDS) / (FRAMES - 1)

        const framePromises = Array.from(
          { length: FRAMES },
          (v, k) => TRIM_START_SECONDS + segmentLength * k
        ).map(async (timestamp) => {
          const blob = await getFrame(props.file!, timestamp)
          const buffer = await blob.arrayBuffer()
          return bufferToBase64(buffer)
        })

        Promise.all(framePromises).then((frames) => {
          setFrames(frames)
          const timeTaken = new Date().getTime() - startTime
          console.log(`rendered frames after ${timeTaken} milliseconds`)
        })
      })
    }
  })

  return (
    <Show when={frames().length > 0}>
      <div>duration: {duration()}</div>
      {frames().map((base64) => (
        <img id="ItemPreview" style={{ width: '300px' }} src={`data:image/png;base64,${base64}`} />
      ))}
    </Show>
  )
}

const bufferToBase64 = (buf: ArrayBuffer) => {
  let binary = ''
  const bytes = new Uint8Array(buf)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
