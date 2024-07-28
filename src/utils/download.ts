import html2canvas from 'html2canvas'

const saveAs = (uri: string, filename: string) => {
  var link = document.createElement('a')

  if (typeof link.download === 'string') {
    link.href = uri
    link.download = filename

    //Firefox requires the link to be in the body
    document.body.appendChild(link)

    //simulate click
    link.click()

    //remove the link when done
    document.body.removeChild(link)
  } else {
    window.open(uri)
  }
}

export const download = async (width: number) => {
  const frames: HTMLElement = document.querySelector('#frames')!
  const scale = width / frames.clientWidth
  const canvas = await html2canvas(frames, { scale })
  saveAs(canvas.toDataURL(), `frames-${new Date().getTime()}.png`)
}
