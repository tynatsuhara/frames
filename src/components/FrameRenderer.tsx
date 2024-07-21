import { Component, Show, createEffect, createSignal } from 'solid-js'
import { VideoMetadata, renderFrames } from '../utils/video'
import styles from './FrameRenderer.module.css'

const TRIM_START_SECONDS = 5
const TRIM_END_SECONDS = 5

const PLACEHOLDER_COLORS = ['#4949bd', '#5a5abe', '#6d6dc9']

type Props = { file?: File; rows: number; columns: number; metadata?: VideoMetadata }

export const FrameRenderer: Component<Props> = (props) => {
  const [frames, setFrames] = createSignal<string[]>([]) // image urls
  const frameCount = () => props.rows * props.columns

  createEffect(() => {
    if (props.file) {
      setFrames([])

      const segmentLength =
        (props.metadata!.duration - TRIM_START_SECONDS - TRIM_END_SECONDS) / (frameCount() - 1)

      const frameTimestamps = Array.from(
        { length: frameCount() },
        (v, k) => TRIM_START_SECONDS + segmentLength * k
      )

      renderFrames(props.file!, frameTimestamps, (f) => {
        setFrames([...frames(), f])
      })
    }
  })

  const width = () => `${100 / props.columns}%`

  return (
    <>
      <div class={styles.FramesContainer}>
        {Array.from({ length: frameCount() }).map((_, i) => {
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
                    'background-color':
                      PLACEHOLDER_COLORS[
                        ((i % props.columns) +
                          (Math.floor(i / props.rows) % PLACEHOLDER_COLORS.length)) %
                          PLACEHOLDER_COLORS.length
                      ],
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
