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
      <header class={styles.header}>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
    </div>
  )
}

export default App
