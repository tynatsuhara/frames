import { Component, Show, createEffect, createSignal } from 'solid-js'
import { getDurationSeconds, getFrames } from '../utils/video'
import styles from './FrameRenderer.module.css'

const GRID_WIDTH = 5
const GRID_HEIGHT = 5
const TRIM_START_SECONDS = 5
const TRIM_END_SECONDS = 5

export const FrameRenderer: Component<{ file: File | undefined }> = (props) => {
  const [frames, setFrames] = createSignal<string[]>([]) // image urls
  const [duration, setDuration] = createSignal<number>()
  const frameCount = GRID_WIDTH * GRID_HEIGHT

  createEffect(() => {
    if (props.file) {
      setFrames([])

      getDurationSeconds(props.file).then((seconds) => {
        setDuration(seconds)

        const segmentLength = (seconds - TRIM_START_SECONDS - TRIM_END_SECONDS) / (frameCount - 1)

        const frameTimestamps = Array.from(
          { length: frameCount },
          (v, k) => TRIM_START_SECONDS + segmentLength * k
        )

        getFrames(props.file!, frameTimestamps).then((f) => setFrames(f))
      })
    }
  })

  const width = `${100 / GRID_WIDTH}%`

  return (
    <Show when={frames().length > 0}>
      <div>duration: {duration()}</div>
      <div class={styles.FramesContainer}>
        {frames().map((url) => (
          <img class={styles.Frame} style={{ width }} src={url} />
        ))}
      </div>
    </Show>
  )
}
