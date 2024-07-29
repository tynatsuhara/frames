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
  const [rendering, setRendering] = createSignal(false)
  const [renderId, setRenderId] = createSignal(1)
  const [metadata, setMetadata] = createSignal<VideoMetadata | undefined>()

  const withResetRender = <T,>(fn: (t: T) => void): ((t: T) => void) => {
    return (t) => {
      setRender(false)
      setRenderId(renderId() + 1)
      fn(t)
    }
  }

  const [rows, setRows] = createSignal(5)
  const [columns, setColumns] = createSignal(10)
  const [renderScale, setRenderScale] = createSignal(0.25)
  const [trimStart, setTrimStart] = createSignal(0)
  const [trimEnd, setTrimEnd] = createSignal(0)
  const [rowPadding, setRowPadding] = createSignal(0)
  const [paddingColor, setPaddingColor] = createSignal('#ffffff')

  const finalWidth = () => Math.floor(metadata()!.videoWidth * renderScale() * columns())
  const finalHeight = () => {
    const paddingHeight = (rows() + 1) * metadata()!.videoHeight * rowPadding()
    return Math.floor(paddingHeight + metadata()!.videoHeight * renderScale() * rows())
  }

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
        <div class={styles.TextContent}>
          <Show when={metadata()}>
            <div class={styles.InputContainer}>
              <div>
                <strong>file name</strong> {file()?.name}
              </div>
              <div>
                <strong>duration</strong> {Math.floor(metadata()!.duration)} seconds
              </div>
              <NumberInput
                label="rows"
                onChange={withResetRender(setRows)}
                value={rows()}
                min={0}
              />
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
                <strong>output dimensions</strong>&nbsp;
                {finalWidth()} x {finalHeight()} px
              </div>
              <div style={{ margin: '1rem' }}>
                <button
                  style={{ 'margin-right': '1rem' }}
                  onclick={() => {
                    setRender(true)
                    setRendering(true)
                  }}
                >
                  render
                </button>
                <Show when={file()}>
                  <button
                    disabled={!render() || rendering()}
                    onclick={() => download(finalWidth())}
                  >
                    download
                  </button>
                </Show>
              </div>
              <div>If you encounter visual artifacts, try turning off hardware acceleration!</div>
            </div>
          </Show>
          <Show when={!metadata()}>
            <div>Drop movie file here!</div>
          </Show>
        </div>
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
        renderCompleteCallback={() => setRendering(false)}
      />
    </div>
  )
}

export default App
