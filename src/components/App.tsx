import { createSignal, type Component } from 'solid-js'

import { download } from '../utils/download'
import { VideoMetadata, getVideoMetadata } from '../utils/video'
import styles from './App.module.css'
import DropZone from './DropZone'
import { FrameRenderer } from './FrameRenderer'
import { NumberInput } from './NumberInput'

const App: Component = () => {
  const [file, setFile] = createSignal<File>()
  const [render, setRender] = createSignal<boolean>(false)
  const [metadata, setMetadata] = createSignal<VideoMetadata | undefined>()

  // todo adjustable params
  const [rows, setRows] = createSignal(5)
  const [columns, setColumns] = createSignal(10)
  const [renderScale, setRenderScale] = createSignal(0.25)
  const [trimStart, setTrimStart] = createSignal(0)
  const [trimEnd, setTrimEnd] = createSignal(0)

  const finalWidth = () => metadata()!.videoWidth * renderScale() * columns()
  const finalHeight = () => metadata()!.videoHeight * renderScale() * rows()

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
        {metadata() ? (
          <div class={styles.InputContainer}>
            <div>
              <strong>file name</strong> {file()?.name}
            </div>
            <div>
              <strong>duration</strong> {Math.floor(metadata()!.duration)} seconds
            </div>
            <NumberInput label="rows" onChange={setRows} value={rows()} min={0} />
            <NumberInput label="columns" onChange={setColumns} value={columns()} min={0} />
            <NumberInput
              label="render scale"
              onChange={setRenderScale}
              value={renderScale()}
              min={0.01}
              max={1}
              step={0.01}
            />
            <NumberInput
              label="trim start (seconds)"
              onChange={setTrimStart}
              value={trimStart()}
              min={0}
            />
            <NumberInput
              label="trim end (seconds)"
              onChange={setTrimEnd}
              value={trimEnd()}
              min={0}
            />
            <div>
              Output dimensions will be {finalWidth()} x {finalHeight()} px
            </div>
            <div>
              <button style={{ 'margin-right': '.5rem' }} onclick={() => setRender(true)}>
                render
              </button>
              {file() ? <button onclick={() => download(finalWidth())}>download</button> : <></>}
            </div>
          </div>
        ) : (
          <div>drop movie file here</div>
        )}
      </DropZone>
      <FrameRenderer
        file={render() ? file() : undefined}
        rows={rows()}
        columns={columns()}
        metadata={metadata()}
        renderScale={renderScale()}
        trimStart={trimStart()}
        trimEnd={trimEnd()}
      />
    </div>
  )
}

export default App
