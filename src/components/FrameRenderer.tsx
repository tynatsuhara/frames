import { Component, For, Show, createEffect, createSignal } from 'solid-js'
import { VideoMetadata, renderFrames } from '../utils/video'
import styles from './FrameRenderer.module.css'

const PLACEHOLDER_COLORS = ['#4949bd', '#5a5abe', '#6d6dc9']

type Props = {
  file?: File
  render: boolean
  renderId: number
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
    setFrames(Array.from<string>({ length: frameCount() }))

    if (props.render) {
      // setRenderId(renderId() + 1)
      // const thisRenderId = renderId()
      const segmentLength =
        (props.metadata!.duration - props.trimStart - props.trimEnd) / (frameCount() - 1)

      const frameTimestamps = Array.from(
        { length: frameCount() },
        (v, k) => props.trimStart + segmentLength * k
      )

      // TODO we need a way to short circuit this
      renderFrames(
        props.file!,
        frameTimestamps,
        props.renderScale,
        props.renderId,
        (f, frameId, renderId) => {
          if (renderId === props.renderId) {
            const newFrames = [...frames()]
            newFrames[frameId] = f
            setFrames(newFrames)
          }
        }
      )
    }
  })

  const width = () => `${100 / props.columns}%`

  return (
    <Show when={props.metadata}>
      <div class={styles.FramesContainerContainer}>
        <div class={styles.FramesContainer} id="frames">
          <For each={Array.from({ length: props.rows })}>
            {(_, i) => {
              // this doesn't work right now because the scaling
              // TODO: just add a row spacer div and scale it with aspect-ratio
              const margin = props.rowPadding * props.metadata!.videoHeight

              return (
                <div class="frame-row" style={{ margin: `${margin}px 0` }}>
                  <For each={Array.from({ length: props.columns })}>
                    {(_, j) => {
                      const rowStartColor = i() % PLACEHOLDER_COLORS.length
                      const placeholder = (j() + rowStartColor) % PLACEHOLDER_COLORS.length
                      const f = i() * props.columns + j()
                      const id = `frame-${f}`

                      return (
                        <>
                          <Show when={frames()[f]}>
                            <img
                              id={id}
                              class={styles.Frame}
                              style={{ width: width() }}
                              src={frames()[f]}
                            />
                          </Show>
                          <Show when={!frames()[f]}>
                            <div
                              id={id}
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
      </div>
    </Show>
  )
}
