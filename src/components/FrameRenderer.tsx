import { Component, Show, createEffect, createSignal } from 'solid-js'
import { getDurationSeconds, getFrames } from '../utils/video'

const FRAMES = 100
const TRIM_START_SECONDS = 5
const TRIM_END_SECONDS = 5

export const FrameRenderer: Component<{ file: File | undefined }> = (props) => {
  const [frames, setFrames] = createSignal<string[]>([]) // image urls
  const [duration, setDuration] = createSignal<number>()

  createEffect(() => {
    if (props.file) {
      setFrames([])

      getDurationSeconds(props.file).then((seconds) => {
        setDuration(seconds)

        const segmentLength = (seconds - TRIM_START_SECONDS - TRIM_END_SECONDS) / (FRAMES - 1)

        const frameTimestamps = Array.from(
          { length: FRAMES },
          (v, k) => TRIM_START_SECONDS + segmentLength * k
        )

        getFrames(props.file!, frameTimestamps).then((f) => setFrames(f))
      })
    }
  })

  return (
    <Show when={frames().length > 0}>
      <div>duration: {duration()}</div>
      {frames().map((url) => (
        <img id="ItemPreview" style={{ width: '300px' }} src={url} />
      ))}
    </Show>
  )
}
