import type { Component } from 'solid-js'

const DropZone: Component<{ fileHandler: (file: File) => void }> = (props) => {
  return (
    <div
      style={{
        width: '200px',
        height: '200px',
        'background-color': 'red',
      }}
      ondragover={(e) => {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
      }}
      ondrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer!.files[0]
        props.fileHandler(file)
        // var reader = new FileReader()
        // reader.onload = () => props.bufferHandler(reader.result as ArrayBuffer)
        // reader.readAsArrayBuffer(file)
        // console.log(data)
        // e.target.appendChild(document.getElementById(data))
      }}
    ></div>
  )
}

export default DropZone
