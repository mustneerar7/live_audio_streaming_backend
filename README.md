# live audio streaming backend
A realtime audio live streaming server using node.js and ffmpeg.
This server receives audio stream from frontend via sockets and converts it into `hls` stream format using  `ffmpeg` in real time. The hls stream is then served to the frontend using express.js.

**NOTE**: FFMPEG must be installed on the server in order to run this project. Link to download ffmpeg: https://www.ffmpeg.org/download.html