import { Component, Show, createEffect, createSignal } from 'solid-js'
import { getFrame } from '../utils/video'

export const FrameRenderer: Component<{ file: File | undefined }> = (props) => {
  const [buf, setBuf] = createSignal<ArrayBuffer>()

  createEffect(() => {
    if (props.file) {
      getFrame(props.file!, 300)
        .then((blob) => blob.arrayBuffer())
        .then((buffer) => setBuf(buffer))
    }
  })

  return (
    <Show when={buf()}>
      <img id="ItemPreview" src={`data:image/png;base64,${bufferToBase64(buf()!)}`} />
    </Show>
  )
}

const bufferToBase64 = (buf: ArrayBuffer) => {
  let binary = ''
  const bytes = new Uint8Array(buf)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
