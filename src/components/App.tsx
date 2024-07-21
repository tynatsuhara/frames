import { createSignal, type Component } from 'solid-js'

import { download } from '../utils/download'
import { VideoMetadata, getVideoMetadata } from '../utils/video'
import styles from './App.module.css'
import DropZone from './DropZone'
import { FrameRenderer } from './FrameRenderer'

const App: Component = () => {
  const [file, setFile] = createSignal<File>()
  const [render, setRender] = createSignal<boolean>(false)
  const [metadata, setMetadata] = createSignal<VideoMetadata | undefined>()

  // adjustable params
  const [rows, setRows] = createSignal(5)
  const [columns, setColumns] = createSignal(10)

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
        <div>Drop movie file here.</div>
        {metadata() ? <div>Duration: {metadata()!.duration}</div> : <></>}
        <button onclick={() => setRender(true)}>render</button>
        <div>For printing, suggested scale is 300 * inches wide.</div>
        {file() ? <button onclick={() => download()}>download</button> : <></>}
      </DropZone>
      <FrameRenderer
        file={render() ? file() : undefined}
        rows={rows()}
        columns={columns()}
        metadata={metadata()}
      />
    </div>
  )
}

export default App
