import { createSignal, type Component } from 'solid-js'

import { VideoMetadata, getVideoMetadata } from '../utils/video'
import styles from './App.module.css'
import DropZone from './DropZone'
import { FrameRenderer } from './FrameRenderer'

const App: Component = () => {
  const [file, setFile] = createSignal<File>()
  const [render, setRender] = createSignal<boolean>(false)
  const [metadata, setMetadata] = createSignal<VideoMetadata | null>(null)

  // adjustable params
  const [rows, setRows] = createSignal(10)
  const [columns, setColumns] = createSignal(20)

  return (
    <div class={styles.App}>
      <DropZone
        fileHandler={(f) => {
          console.log(f)
          setFile(f)
          setRender(false)
          setMetadata(null)
          getVideoMetadata(f).then((metadata) => setMetadata(metadata))
        }}
      >
        <div>Drop movie file here.</div>
        {metadata() ? <div>Duration: {metadata()!.duration}</div> : <></>}
        <button onclick={() => setRender(true)}>render</button>
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
