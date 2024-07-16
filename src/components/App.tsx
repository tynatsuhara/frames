import { createSignal, type Component } from 'solid-js'

import styles from './App.module.css'
import DropZone from './DropZone'
import { FrameRenderer } from './FrameRenderer'

const App: Component = () => {
  const [file, setFile] = createSignal<File>()

  return (
    <div class={styles.App}>
      <DropZone
        fileHandler={(f) => {
          console.log(f)
          setFile(f)
        }}
      />
      <FrameRenderer file={file()} />
    </div>
  )
}

export default App
