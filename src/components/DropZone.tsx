import type { Component, JSX } from 'solid-js'
import styles from './DropZone.module.css'

type Props = { fileHandler: (file: File) => void; children?: JSX.Element }

const DropZone: Component<Props> = (props) => {
  return (
    <div
      class={styles.DropZone}
      ondragover={(e) => {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
      }}
      ondrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer!.files[0]
        if (file.name.endsWith('.mkv')) {
          // TODO use ffmpeg worker
          alert('mkv is not supported')
        } else if (file.name.endsWith('.mp4')) {
          props.fileHandler(file)
        } else {
          alert('Only MP4 and mkv files are supported!')
        }
        // var reader = new FileReader()
        // reader.onload = () => props.bufferHandler(reader.result as ArrayBuffer)
        // reader.readAsArrayBuffer(file)
        // console.log(data)
        // e.target.appendChild(document.getElementById(data))
      }}
    >
      {props.children}
    </div>
  )
}

export default DropZone
