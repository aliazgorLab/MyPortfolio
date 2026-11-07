import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3009;
const BRAIN_DIR = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\81a00a38-716c-4736-a1aa-cdd8f385c342';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function waitForServer(port, timeout = 35000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(`http://localhost:${port}`, (res) => {
        resolve();
      }).on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server failed to start on port ${port} within timeout`));
        } else {
          setTimeout(check, 1000);
        }
      });
    };
    check();
  });
}

function captureScreenshot(url, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=4000',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${outputPath}`,
      url
    ];

    const proc = spawn(EDGE_PATH, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Edge exited with code ${code}`));
    });
  });
}

async function run() {
  const server = spawn('cmd.exe', ['/c', `npx next start -p ${PORT}`], {
    cwd: path.resolve('frontend'),
    stdio: 'inherit'
  });

  try {
    await waitForServer(PORT);
    const outLogo = path.join(BRAIN_DIR, 'navbar-signature-closeup.png');
    await captureScreenshot(`http://localhost:${PORT}/`, outLogo, 800, 200);
    console.log(`Captured: ${outLogo} (${fs.statSync(outLogo).size} bytes)`);
  } finally {
    spawn('taskkill', ['/F', '/T', '/PID', server.pid.toString()]);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
