import { createSignal, Show, type Component } from 'solid-js'

import { download } from '../utils/download'
import { getVideoMetadata, VideoMetadata } from '../utils/video'
import styles from './App.module.css'
import { ColorInput } from './ColorInput'
import DropZone from './DropZone'
import { FrameRenderer } from './FrameRenderer'
import { NumberInput } from './NumberInput'

const App: Component = () => {
  const [file, setFile] = createSignal<File>()
  const [render, setRender] = createSignal(false)
  const [renderId, setRenderId] = createSignal(1)
  const [metadata, setMetadata] = createSignal<VideoMetadata | undefined>()

  const withResetRender = <T,>(fn: (t: T) => void): ((t: T) => void) => {
    return (t) => {
      setRender(false)
      setRenderId(renderId() + 1)
      fn(t)
    }
  }

  // todo adjustable params
  const [rows, setRows] = createSignal(5)
  const [columns, setColumns] = createSignal(10)
  const [renderScale, setRenderScale] = createSignal(0.25)
  const [trimStart, setTrimStart] = createSignal(0)
  const [trimEnd, setTrimEnd] = createSignal(0)
  const [rowPadding, setRowPadding] = createSignal(0)
  const [paddingColor, setPaddingColor] = createSignal('#ffffff')

  const finalWidth = () => Math.floor(metadata()!.videoWidth * renderScale() * columns())
  const finalHeight = () => Math.floor(metadata()!.videoHeight * renderScale() * rows())

  return (
    <div class={styles.App}>
      <DropZone
        fileHandler={(f) => {
          console.log(f)
          setFile(f)
          setRender(false)
          setMetadata(undefined)
          getVideoMetadata(f).then((metadata) => setMetadata(metadata))
        }}
      >
        <h1>🄵🅁🄰🄼🄴🅂</h1>
        <Show when={metadata()}>
          <div class={styles.InputContainer}>
            <div>
              <strong>file name</strong> {file()?.name}
            </div>
            <div>
              <strong>duration</strong> {Math.floor(metadata()!.duration)} seconds
            </div>
            <NumberInput label="rows" onChange={withResetRender(setRows)} value={rows()} min={0} />
            <NumberInput
              label="columns"
              onChange={withResetRender(setColumns)}
              value={columns()}
              min={0}
            />
            <NumberInput
              label="render scale"
              onChange={withResetRender(setRenderScale)}
              value={renderScale()}
              min={0.01}
              max={1}
              step={0.01}
            />
            <NumberInput
              label="trim start (seconds)"
              onChange={withResetRender(setTrimStart)}
              value={trimStart()}
              min={0}
            />
            <NumberInput
              label="trim end (seconds)"
              onChange={withResetRender(setTrimEnd)}
              value={trimEnd()}
              min={0}
            />
            <NumberInput
              label="row padding (%)"
              onChange={setRowPadding}
              value={rowPadding()}
              min={0}
              max={1}
              step={0.01}
            />
            <ColorInput label="padding color" onChange={setPaddingColor} value={paddingColor()} />
            <div>
              Output dimensions will be {finalWidth()} x {finalHeight()} px
            </div>
            <div>
              <button style={{ 'margin-right': '.5rem' }} onclick={() => setRender(true)}>
                render
              </button>
              <Show when={file()}>
                <button onclick={() => download(finalWidth())}>download</button>
              </Show>
            </div>
          </div>
        </Show>
        <Show when={!metadata()}>
          <div>drop movie file here</div>
        </Show>
      </DropZone>
      <FrameRenderer
        file={file()}
        render={render()}
        renderId={renderId()}
        rows={rows()}
        columns={columns()}
        metadata={metadata()}
        renderScale={renderScale()}
        trimStart={trimStart()}
        trimEnd={trimEnd()}
        rowPadding={rowPadding()}
        paddingColor={paddingColor()}
      />
    </div>
  )
}

export default App
