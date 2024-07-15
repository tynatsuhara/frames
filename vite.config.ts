import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
// import devtools from 'solid-devtools/vite';

export default () => {
  const ffmpegScript = readFileSync('node_modules/ffmpeg.js/ffmpeg-worker-mp4.js', 'utf8')

  process.env = { ...process.env, VITE_FFMPEG_SCRIPT: ffmpegScript }

  return defineConfig({
    plugins: [
      /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
      // devtools(),
      solidPlugin(),
    ],
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
    },
  })
}
