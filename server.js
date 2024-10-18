const WebSocket = require("ws");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const outputDir = path.join(__dirname, "hls");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const app = express();

app.use(cors());
app.use('/hls', express.static(outputDir));

const server = app.listen(8082, () => {
  console.log("HTTP server is listening on port 8082");
});

const wss = new WebSocket.Server({ server });

let ffmpegProcess = null;

const startFFmpeg = () => {
  if (ffmpegProcess) {
    ffmpegProcess.kill("SIGINT");
  }

  const streamKey = "audio";
  const playlist = path.join(outputDir, `${streamKey}.m3u8`);

  ffmpegProcess = spawn("ffmpeg", [
    "-f", "webm",
    "-i", "pipe:0",
    "-c:a", "aac",
    "-b:a", "128k",
    "-f", "hls",
    "-hls_time", "6",
    "-hls_segment_filename", path.join(outputDir, `${streamKey}_%03d.ts`),
    playlist,
  ]);

  ffmpegProcess.stdout.on("data", (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on("error", (err) => {
    console.error(`FFmpeg process error: ${err.message}`);
    ffmpegProcess = null;
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    if (code !== 0) {
      console.error(`FFmpeg process exited with non-zero code: ${code}`);
    }
    ffmpegProcess = null;
    startFFmpeg();
  });
};

startFFmpeg();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message of size ${message.byteLength} bytes`);
    if (ffmpegProcess) {
      try {
        ffmpegProcess.stdin.write(Buffer.from(message));
      } catch (error) {
        console.error(`Error writing to FFmpeg stdin: ${error.message}`);
      }
    } else {
      console.error("FFmpeg process not available. Dropping message.");
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (ffmpegProcess) {
      ffmpegProcess.kill("SIGINT");
      ffmpegProcess = null;
    }
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
  });
});