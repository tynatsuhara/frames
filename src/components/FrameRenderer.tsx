import { Component, For, Show, createEffect, createSignal } from 'solid-js'
import { VideoMetadata, renderFrames } from '../utils/video'
import styles from './FrameRenderer.module.css'

const PLACEHOLDER_COLORS = ['#4949bd', '#5a5abe', '#6d6dc9']

type Props = {
  file?: File
  render: boolean
  metadata?: VideoMetadata
  rows: number
  columns: number
  renderScale: number
  trimStart: number
  trimEnd: number
  rowPadding: number
  paddingColor: string
}

export const FrameRenderer: Component<Props> = (props) => {
  const [frames, setFrames] = createSignal<string[]>([]) // image urls
  const frameCount = () => props.rows * props.columns

  createEffect(() => {
    setFrames([])

    if (props.render) {
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

  const padding = () => <></>

  return (
    <Show when={props.metadata}>
      <div class={styles.FramesContainer} id="frames">
        <For each={Array.from({ length: props.rows })}>
          {(_, i) => {
            // this doesn't work right now because the scaling
            // TODO: just add a row spacer div and scale it with aspect-ratio
            const margin = props.rowPadding * props.metadata!.videoHeight
            console.log(margin)

            return (
              <div class="frame-row" style={{ margin: `${margin}px 0` }}>
                <For each={Array.from({ length: props.columns })}>
                  {(_, j) => {
                    const rowStartColor = i() % PLACEHOLDER_COLORS.length
                    const placeholder = (j() + rowStartColor) % PLACEHOLDER_COLORS.length
                    const f = i() * props.columns + j()

                    return (
                      <>
                        <Show when={frames().length > f}>
                          <img class={styles.Frame} style={{ width: width() }} src={frames()[f]} />
                        </Show>
                        <Show when={frames().length <= f}>
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
                  }}
                </For>
              </div>
            )
          }}
        </For>
      </div>
    </Show>
  )
}
