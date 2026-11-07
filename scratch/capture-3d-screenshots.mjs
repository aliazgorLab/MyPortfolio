import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const artDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\81a00a38-716c-4736-a1aa-cdd8f385c342";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function waitServerReady(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function run() {
  console.log("🚀 Starting Next.js production server on port 3005...");
  const server = spawn("cmd.exe", ["/c", "npx", "next", "start", "-p", "3005"], {
    cwd: path.resolve("frontend"),
    stdio: "pipe",
  });

  server.stdout.on("data", (d) => console.log(`[Next] ${d.toString().trim()}`));
  server.stderr.on("data", (d) => console.error(`[Next ERR] ${d.toString().trim()}`));

  try {
    const ready = await waitServerReady("http://127.0.0.1:3005", 25);
    if (!ready) {
      throw new Error("Server failed to respond on port 3005");
    }
    console.log("✓ Server ready on http://127.0.0.1:3005");

    const targets = [
      {
        name: "3d-universe-hub.png",
        url: "http://127.0.0.1:3005/universe",
        size: "1920,1080",
        delay: 6000,
      },
      {
        name: "3d-graphic-corridor.png",
        url: "http://127.0.0.1:3005/universe/graphic-design",
        size: "1920,1080",
        delay: 6000,
      },
      {
        name: "3d-artwork-inspection.png",
        url: "http://127.0.0.1:3005/universe/graphic-design?exhibit=aura-monogram",
        size: "1920,1080",
        delay: 7500,
      },
      {
        name: "3d-graphic-mobile.png",
        url: "http://127.0.0.1:3005/universe/graphic-design",
        size: "390,844",
        delay: 6000,
      },
    ];

    for (const t of targets) {
      const outPath = path.join(artDir, t.name);
      console.log(`📸 Capturing ${t.name} (${t.url})...`);
      const cmd = `"${edgePath}" --headless --disable-gpu --virtual-time-budget=${t.delay} --window-size=${t.size} --screenshot="${outPath}" "${t.url}"`;
      try {
        execSync(cmd, { stdio: "ignore" });
        if (fs.existsSync(outPath)) {
          const stats = fs.statSync(outPath);
          console.log(`  ✓ Saved: ${t.name} (${Math.round(stats.size / 1024)} KB)`);
        } else {
          console.log(`  ⚠️ File not found: ${t.name}`);
        }
      } catch (err) {
        console.error(`  ❌ Failed capturing ${t.name}:`, err.message);
      }
    }
  } finally {
    console.log("🛑 Stopping test server...");
    server.kill("SIGKILL");
    try {
      execSync("taskkill /F /IM node.exe /FI \"WINDOWTITLE eq Next*\"", { stdio: "ignore" });
    } catch {}
  }
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
