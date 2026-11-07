import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3008;
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
      '--virtual-time-budget=6000',
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
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('cmd.exe', ['/c', `npx next start -p ${PORT}`], {
    cwd: path.resolve('frontend'),
    stdio: 'inherit'
  });

  try {
    await waitForServer(PORT);
    console.log(`Server ready on port ${PORT}. Capturing screenshots...`);

    // 1. Desktop 1920x1080
    const out1920 = path.join(BRAIN_DIR, 'hero-centered-1920x1080.png');
    await captureScreenshot(`http://localhost:${PORT}/`, out1920, 1920, 1080);
    console.log(`Captured: ${out1920} (${fs.statSync(out1920).size} bytes)`);

    // 2. Desktop 1440x900
    const out1440 = path.join(BRAIN_DIR, 'hero-centered-1440x900.png');
    await captureScreenshot(`http://localhost:${PORT}/`, out1440, 1440, 900);
    console.log(`Captured: ${out1440} (${fs.statSync(out1440).size} bytes)`);

    // 3. Laptop 1366x768
    const out1366 = path.join(BRAIN_DIR, 'hero-centered-1366x768.png');
    await captureScreenshot(`http://localhost:${PORT}/`, out1366, 1366, 768);
    console.log(`Captured: ${out1366} (${fs.statSync(out1366).size} bytes)`);

    // 4. Mobile 390x844
    const out390 = path.join(BRAIN_DIR, 'hero-centered-390x844.png');
    await captureScreenshot(`http://localhost:${PORT}/`, out390, 390, 844);
    console.log(`Captured: ${out390} (${fs.statSync(out390).size} bytes)`);

    console.log('All hero screenshots captured successfully with virtual time budget!');
  } finally {
    console.log('Stopping server...');
    spawn('taskkill', ['/F', '/T', '/PID', server.pid.toString()]);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
