// USE THIS SCRIPT FOR RECORDING AND PROCESSING AUDIO ON SERVER SIDE

// const express = require("express");
// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// const PORT = process.env.PORT || 3000;

// const outputDir = path.join(__dirname, "hls");
// if (!fs.existsSync(outputDir)) {
//   fs.mkdirSync(outputDir);
// }

// let ffmpegProcess = null;

// // Route to start recording
// app.get("/start", (req, res) => {
//   if (ffmpegProcess) {
//     return res.status(400).send("Recording is already in progress.");
//   }

//   const streamKey = req.query.key || "audio";
//   const playlist = path.join(outputDir, `${streamKey}.m3u8`);

//   // FFmpeg command to record audio and generate HLS segments
//   ffmpegProcess = spawn("ffmpeg", [
//     "-f",
//     "dshow",
//     "-i",
//     "audio=Microphone Array (2- Realtek High Definition Audio(SST))",
//     "-c:a",
//     "aac",
//     "-b:a",
//     "128k",
//     "-f",
//     "hls",
//     "-hls_time",
//     "4",
//     "-hls_list_size",
//     "5",
//     "-hls_flags",
//     "delete_segments",
//     "-hls_segment_filename",
//     path.join(outputDir, `${streamKey}_%03d.ts`),
//     playlist,
//   ]);

//   ffmpegProcess.stdout.on("data", (data) => {
//     console.log(`FFmpeg stdout: ${data}`);
//   });

//   ffmpegProcess.stderr.on("data", (data) => {
//     console.error(`FFmpeg stderr: ${data}`);
//   });

//   ffmpegProcess.on("close", (code) => {
//     console.log(`FFmpeg process exited with code ${code}`);
//     ffmpegProcess = null;
//   });

//   res.send("Recording started...");
// });

// app.use("/hls", express.static(outputDir));

// // Route to stop recording
// app.get("/stop", (req, res) => {
//   if (ffmpegProcess) {
//     ffmpegProcess.kill("SIGINT");
//     res.send("Recording stopped.");
//   } else {
//     res.status(400).send("No recording in progress.");
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
