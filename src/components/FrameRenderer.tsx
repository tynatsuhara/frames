import { Component, Show, createEffect, createSignal } from 'solid-js'
import { VideoMetadata, renderFrames } from '../utils/video'
import styles from './FrameRenderer.module.css'

const PLACEHOLDER_COLORS = ['#4949bd', '#5a5abe', '#6d6dc9']

type Props = {
  file?: File
  metadata?: VideoMetadata
  rows: number
  columns: number
  renderScale: number
  trimStart: number
  trimEnd: number
}

export const FrameRenderer: Component<Props> = (props) => {
  const [frames, setFrames] = createSignal<string[]>([]) // image urls
  const frameCount = () => props.rows * props.columns

  createEffect(() => {
    if (props.file) {
      setFrames([])

      const segmentLength =
        (props.metadata!.duration - props.trimStart - props.trimEnd) / (frameCount() - 1)

      const frameTimestamps = Array.from(
        { length: frameCount() },
        (v, k) => props.trimStart + segmentLength * k
      )

      renderFrames(props.file!, frameTimestamps, props.renderScale, (f) => {
        setFrames([...frames(), f])
      })
    }
  })

  const width = () => `${100 / props.columns}%`

  return (
    <>
      <div class={styles.FramesContainer} id="frames">
        {Array.from({ length: frameCount() }).map((_, i) => {
          const rowStartColor = Math.floor(i / props.columns) % PLACEHOLDER_COLORS.length
          const placeholder = ((i % props.columns) + rowStartColor) % PLACEHOLDER_COLORS.length

          return (
            <>
              <Show when={frames().length > i}>
                <img class={styles.Frame} style={{ width: width() }} src={frames()[i]} />
              </Show>
              <Show when={props.metadata && frames().length <= i}>
                <div
                  class={styles.FramePlaceholder}
                  style={{
                    width: width(),
                    'aspect-ratio': `${props.metadata!.videoWidth} / ${props.metadata!.videoHeight}`,
                    'background-color': PLACEHOLDER_COLORS[placeholder],
                  }}
                />
              </Show>
            </>
          )
        })}
      </div>
    </>
  )
}
