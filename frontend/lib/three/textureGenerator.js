/**
 * Procedural High-Resolution Texture Generator for 3D Exhibition Artworks.
 * Generates visually accurate, domain-authentic textures for:
 * - Logo Design (monograms, geometric grid brandmarks, esports insignias)
 * - Brand Identity (corporate guideline sheets, color matrices, stationery mockups)
 * - Poster Design (Bauhaus constructivism, typographic silkscreen, cybernetics)
 * - Banner Design (16:9 widescreen web heroes, display ads)
 * - Social Media Design (1:1 square carousels, fintech infographics)
 * - Print Design (tri-fold brochure spreads, CMYK layouts)
 */

export function createArtworkTexture(type, id) {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Determine canvas aspect ratio based on artwork type
  let width = 1024;
  let height = 1024;

  if (type === "poster") {
    width = 1080;
    height = 1440; // 3:4 vertical poster
  } else if (type === "brand-identity" || type === "banner") {
    width = 1920;
    height = 1080; // 16:9 widescreen
  } else if (type === "brochure") {
    width = 1440;
    height = 1080; // 4:3 print spread
  }

  canvas.width = width;
  canvas.height = height;

  // Background base
  ctx.fillStyle = "#0A0B0E";
  ctx.fillRect(0, 0, width, height);

  // Render specific artwork texture
  switch (id) {
    case "aura-monogram":
      renderAuraLogo(ctx, width, height);
      break;
    case "kromatik-esports":
      renderKromatikLogo(ctx, width, height);
      break;
    case "vanguard-identity":
      renderVanguardIdentity(ctx, width, height);
      break;
    case "bauhaus-poster":
      renderBauhausPoster(ctx, width, height);
      break;
    case "cybernetics-poster":
      renderCyberneticsPoster(ctx, width, height);
      break;
    case "apex-banner":
      renderApexBanner(ctx, width, height);
      break;
    case "paypulse-social":
      renderPayPulseSocial(ctx, width, height);
      break;
    case "techfest-brochure":
      renderTechFestBrochure(ctx, width, height);
      break;
    default:
      renderGenericArtwork(ctx, width, height, id);
      break;
  }

  return canvas;
}

function renderAuraLogo(ctx, w, h) {
  // Dark obsidian background with architectural grid
  ctx.fillStyle = "#08090B";
  ctx.fillRect(0, 0, w, h);

  // Precision background grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Golden ratio construction circles (subtle)
  ctx.strokeStyle = "rgba(244, 106, 69, 0.15)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 50, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 50, 140, 0, Math.PI * 2);
  ctx.stroke();

  // Central Geometric Monogram 'A'
  ctx.save();
  ctx.translate(w / 2, h / 2 - 50);

  // Shadow / Glow behind logo
  ctx.shadowColor = "rgba(244, 106, 69, 0.6)";
  ctx.shadowBlur = 40;

  // Outer Hexagon
  ctx.strokeStyle = "#F46A45";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 6;
    const x = Math.cos(angle) * 160;
    const y = Math.sin(angle) * 160;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Inner Isometric 'A' Structure
  ctx.fillStyle = "#F5F3F0";
  ctx.beginPath();
  ctx.moveTo(0, -110);
  ctx.lineTo(75, 45);
  ctx.lineTo(45, 45);
  ctx.lineTo(25, 0);
  ctx.lineTo(-25, 0);
  ctx.lineTo(-45, 45);
  ctx.lineTo(-75, 45);
  ctx.closePath();
  ctx.fill();

  // Crossbar cutout
  ctx.fillStyle = "#08090B";
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(16, -20);
  ctx.lineTo(-16, -20);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Typographic Brand Lockup
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "bold 44px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.25em";
  ctx.fillText("AURA STUDIO", w / 2, h / 2 + 190);

  ctx.fillStyle = "#F46A45";
  ctx.font = "600 16px 'JetBrains Mono', monospace";
  ctx.letterSpacing = "0.35em";
  ctx.fillText("SPATIAL LIGHTING & ARCHITECTURE", w / 2, h / 2 + 230);

  // Border Accent
  ctx.strokeStyle = "rgba(244, 106, 69, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Technical Specs Corner Tags
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.fillText("SYS // 01 · VECTOR MARK", 50, 60);
  ctx.textAlign = "right";
  ctx.fillText("RATIO 1:1 · ISOMETRIC", w - 50, 60);
}

function renderKromatikLogo(ctx, w, h) {
  // Deep charcoal background
  ctx.fillStyle = "#0B0C10";
  ctx.fillRect(0, 0, w, h);

  // Dynamic Angular Backdrop Rays
  ctx.save();
  ctx.translate(w / 2, h / 2 - 40);
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.fillStyle = i % 2 === 0 ? "rgba(244, 106, 69, 0.05)" : "transparent";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(400, -60);
    ctx.lineTo(400, 60);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Esports Shield Insignia
  ctx.save();
  ctx.translate(w / 2, h / 2 - 40);

  // Glow
  ctx.shadowColor = "#FF8662";
  ctx.shadowBlur = 35;

  // Outer Shield
  ctx.fillStyle = "#18191E";
  ctx.strokeStyle = "#F46A45";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(0, -180);
  ctx.lineTo(160, -90);
  ctx.lineTo(130, 110);
  ctx.lineTo(0, 190);
  ctx.lineTo(-130, 110);
  ctx.lineTo(-160, -90);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner Crest Wings
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#F46A45";
  ctx.beginPath();
  ctx.moveTo(0, -130);
  ctx.lineTo(100, -50);
  ctx.lineTo(80, 70);
  ctx.lineTo(0, 130);
  ctx.lineTo(-80, 70);
  ctx.lineTo(-100, -50);
  ctx.closePath();
  ctx.fill();

  // White Mascot Core (Falcon/Wolf stylization)
  ctx.fillStyle = "#F5F3F0";
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.lineTo(50, -20);
  ctx.lineTo(25, 40);
  ctx.lineTo(0, 15);
  ctx.lineTo(-25, 40);
  ctx.lineTo(-50, -20);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Typographic Label
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "900 48px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.2em";
  ctx.fillText("KROMATIK", w / 2, h / 2 + 210);

  ctx.fillStyle = "#FF8662";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.letterSpacing = "0.3em";
  ctx.fillText("COMPETITIVE GAMING CLUB", w / 2, h / 2 + 250);

  // Frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, w - 60, h - 60);
}

function renderVanguardIdentity(ctx, w, h) {
  // 16:9 Comprehensive Brand Identity Manual Sheet
  ctx.fillStyle = "#0A0B0E";
  ctx.fillRect(0, 0, w, h);

  // Left Column: Logo & Wordmark Standards (width: 700px)
  ctx.fillStyle = "#111216";
  ctx.fillRect(50, 50, 720, h - 100);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(50, 50, 720, h - 100);

  // Top header in left column
  ctx.fillStyle = "#F46A45";
  ctx.font = "600 14px 'JetBrains Mono', monospace";
  ctx.fillText("BRAND IDENTITY SPECIFICATIONS // SECTION 01", 80, 95);

  ctx.fillStyle = "#F5F3F0";
  ctx.font = "bold 38px 'Space Grotesk', sans-serif";
  ctx.fillText("VANGUARD SYSTEMS", 80, 150);

  ctx.fillStyle = "#85858F";
  ctx.font = "14px 'Inter', sans-serif";
  ctx.fillText("Industrial Engineering & Distributed Infrastructure", 80, 180);

  // Logo Symbol Box
  ctx.fillStyle = "#18191E";
  ctx.fillRect(80, 220, 660, 360);
  ctx.strokeStyle = "rgba(244, 106, 69, 0.3)";
  ctx.strokeRect(80, 220, 660, 360);

  // Render Vanguard Mark inside box
  ctx.save();
  ctx.translate(410, 400);
  ctx.fillStyle = "#F46A45";
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.lineTo(80, 50);
  ctx.lineTo(40, 50);
  ctx.lineTo(0, -20);
  ctx.lineTo(-40, 50);
  ctx.lineTo(-80, 50);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#F5F3F0";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(50, 90);
  ctx.lineTo(20, 90);
  ctx.lineTo(0, 50);
  ctx.lineTo(-20, 90);
  ctx.lineTo(-50, 90);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Clear-space dimension lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(300, 280, 220, 240);
  ctx.setLineDash([]);
  ctx.fillStyle = "#85858F";
  ctx.font = "11px monospace";
  ctx.fillText("SAFETY CLEAR-SPACE = 2X", 320, 270);

  // Right Top: Color Matrix
  ctx.fillStyle = "#111216";
  ctx.fillRect(810, 50, 1060, 360);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(810, 50, 1060, 360);

  ctx.fillStyle = "#F46A45";
  ctx.font = "600 14px 'JetBrains Mono', monospace";
  ctx.fillText("COLOR HIERARCHY & TOKEN PALETTE", 840, 95);

  const colors = [
    { name: "Obsidian Black", hex: "#08090B", rgb: "RGB 8, 9, 11", cmyk: "CMYK 75, 68, 67, 90" },
    { name: "Kinetic Orange", hex: "#F46A45", rgb: "RGB 244, 106, 69", cmyk: "CMYK 0, 71, 78, 0" },
    { name: "Signal Light", hex: "#FF8662", rgb: "RGB 255, 134, 98", cmyk: "CMYK 0, 57, 56, 0" },
    { name: "Industrial Mist", hex: "#DAD9D6", rgb: "RGB 218, 217, 214", cmyk: "CMYK 13, 9, 11, 0" },
  ];

  colors.forEach((col, idx) => {
    const rx = 840 + idx * 255;
    ctx.fillStyle = col.hex;
    ctx.fillRect(rx, 130, 230, 140);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.strokeRect(rx, 130, 230, 140);

    ctx.fillStyle = "#F5F3F0";
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillText(col.name, rx, 300);

    ctx.fillStyle = "#85858F";
    ctx.font = "12px monospace";
    ctx.fillText(col.hex, rx, 325);
    ctx.fillText(col.cmyk, rx, 345);
  });

  // Right Bottom: Stationery Mockup representation
  ctx.fillStyle = "#111216";
  ctx.fillRect(810, 440, 1060, 590);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(810, 440, 1060, 590);

  ctx.fillStyle = "#F46A45";
  ctx.font = "600 14px 'JetBrains Mono', monospace";
  ctx.fillText("STATIONERY & PRINT COLLATERAL STANDARDS", 840, 485);

  // Business Card 1 (Front)
  ctx.fillStyle = "#18191E";
  ctx.fillRect(860, 520, 420, 240);
  ctx.strokeStyle = "#F46A45";
  ctx.lineWidth = 2;
  ctx.strokeRect(860, 520, 420, 240);

  ctx.fillStyle = "#F46A45";
  ctx.font = "bold 20px 'Space Grotesk', sans-serif";
  ctx.fillText("VANGUARD", 890, 570);
  ctx.fillStyle = "#DAD9D6";
  ctx.font = "bold 14px 'Inter', sans-serif";
  ctx.fillText("MD ALI AZGOR", 890, 670);
  ctx.fillStyle = "#85858F";
  ctx.font = "11px monospace";
  ctx.fillText("PRINCIPAL CREATIVE SYSTEMS", 890, 690);
  ctx.fillText("ali.azgor@vanguard-sys.com", 890, 715);

  // Business Card 2 (Back)
  ctx.fillStyle = "#F46A45";
  ctx.fillRect(1330, 520, 420, 240);
  ctx.fillStyle = "#08090B";
  ctx.font = "900 32px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VANGUARD", 1540, 650);
  ctx.textAlign = "left";
}

function renderBauhausPoster(ctx, w, h) {
  // 3:4 Vertical Typographic Exhibition Poster
  ctx.fillStyle = "#090A0D";
  ctx.fillRect(0, 0, w, h);

  // Bold Asymmetric Orange Diagonal Stripe
  ctx.fillStyle = "#F46A45";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.35);
  ctx.lineTo(w, h * 0.15);
  ctx.lineTo(w, h * 0.45);
  ctx.lineTo(0, h * 0.65);
  ctx.closePath();
  ctx.fill();

  // Black Circle intersection
  ctx.fillStyle = "#08090B";
  ctx.beginPath();
  ctx.arc(w * 0.65, h * 0.4, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#F5F3F0";
  ctx.lineWidth = 6;
  ctx.stroke();

  // White geometric square
  ctx.fillStyle = "#F5F3F0";
  ctx.fillRect(w * 0.12, h * 0.22, 280, 280);

  // Red accent small circle
  ctx.fillStyle = "#9B3825";
  ctx.beginPath();
  ctx.arc(w * 0.12 + 140, h * 0.22 + 140, 70, 0, Math.PI * 2);
  ctx.fill();

  // Monumental Vertical Typography
  ctx.save();
  ctx.translate(w * 0.88, h * 0.88);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "900 110px 'Space Grotesk', sans-serif";
  ctx.letterSpacing = "0.08em";
  ctx.fillText("BAUHAUS", 0, 0);
  ctx.restore();

  // Top Exhibition Details
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "900 52px 'Space Grotesk', sans-serif";
  ctx.fillText("SPATIAL ARCHITECTURE", 60, 110);
  ctx.fillText("& ASYMMETRIC GRID", 60, 170);

  ctx.fillStyle = "#F46A45";
  ctx.font = "700 18px 'JetBrains Mono', monospace";
  ctx.letterSpacing = "0.3em";
  ctx.fillText("EXHIBITION 2024 · DESSAU TO CHITTAGONG", 60, 220);

  // Bottom Editorial Credits
  ctx.fillStyle = "#85858F";
  ctx.font = "14px 'Inter', sans-serif";
  ctx.fillText("Curated Typographic Studies on Form, Tension, and Space", 60, h - 110);
  ctx.fillText("Silkscreen Limited Edition on 350 GSM Cotton Rag", 60, h - 85);

  ctx.fillStyle = "#F46A45";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "right";
  ctx.fillText("POSTER // 03", w - 60, h - 85);
  ctx.textAlign = "left";

  // White Outline Border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, w - 40, h - 40);
}

function renderCyberneticsPoster(ctx, w, h) {
  // 3:4 Vertical Cybernetics Speculative Poster
  ctx.fillStyle = "#08090B";
  ctx.fillRect(0, 0, w, h);

  // Digital Wireframe Mesh
  ctx.strokeStyle = "rgba(244, 106, 69, 0.15)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    const y = 200 + i * 25;
    ctx.beginPath();
    ctx.moveTo(60, y);
    for (let x = 60; x <= w - 60; x += 40) {
      const dist = Math.abs(x - w / 2);
      const wave = Math.sin((x + i * 30) * 0.02) * Math.max(0, 60 - dist * 0.15);
      ctx.lineTo(x, y - wave);
    }
    ctx.stroke();
  }

  // Neon Duotone Focal Sphere
  const grad = ctx.createRadialGradient(w / 2, h * 0.52, 20, w / 2, h * 0.52, 240);
  grad.addColorStop(0, "#FF8662");
  grad.addColorStop(0.5, "#F46A45");
  grad.addColorStop(0.8, "#9B3825");
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.52, 240, 0, Math.PI * 2);
  ctx.fill();

  // Crosshairs & HUD markers
  ctx.strokeStyle = "#F5F3F0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 40, h * 0.52);
  ctx.lineTo(w / 2 + 40, h * 0.52);
  ctx.moveTo(w / 2, h * 0.52 - 40);
  ctx.lineTo(w / 2, h * 0.52 + 40);
  ctx.stroke();

  // Typography
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "900 68px 'Space Grotesk', sans-serif";
  ctx.letterSpacing = "0.05em";
  ctx.fillText("CYBERNETICS", 60, 110);

  ctx.fillStyle = "#F46A45";
  ctx.font = "700 24px 'JetBrains Mono', monospace";
  ctx.fillText("SPECULATIVE NEURAL LOOM 2030", 60, 155);

  ctx.fillStyle = "#DAD9D6";
  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillText("TELEMETRY // LATENCY < 0.4MS", 60, h - 90);
  ctx.fillText("IIUC MEDIA LAB EXHIBIT", 60, h - 65);

  // Border
  ctx.strokeStyle = "rgba(244, 106, 69, 0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(25, 25, w - 50, h - 50);
}

function renderApexBanner(ctx, w, h) {
  // 16:9 Widescreen SaaS Platform Launch Banner
  ctx.fillStyle = "#0A0B0E";
  ctx.fillRect(0, 0, w, h);

  // Ambient Glow right side
  const grad = ctx.createRadialGradient(w * 0.75, h * 0.5, 50, w * 0.75, h * 0.5, 500);
  grad.addColorStop(0, "rgba(244, 106, 69, 0.3)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Left Content: Bold Headline
  ctx.fillStyle = "#F46A45";
  ctx.font = "700 18px 'JetBrains Mono', monospace";
  ctx.letterSpacing = "0.25em";
  ctx.fillText("ENTERPRISE CLOUD SUITE // 2024", 100, 280);

  ctx.fillStyle = "#F5F3F0";
  ctx.font = "900 64px 'Space Grotesk', sans-serif";
  ctx.fillText("SCALE BEYOND LIMITS.", 100, 370);

  ctx.fillStyle = "#85858F";
  ctx.font = "24px 'Inter', sans-serif";
  ctx.fillText("Next-generation distributed infrastructure for high-velocity teams.", 100, 430);

  // CTA Button representation
  ctx.fillStyle = "#F46A45";
  ctx.fillRect(100, 480, 260, 65);
  ctx.fillStyle = "#08090B";
  ctx.font = "bold 20px 'Space Grotesk', sans-serif";
  ctx.fillText("DEPLOY INSTANTLY →", 125, 522);

  // Right Side: Isometric Cloud Architecture Mockup
  ctx.save();
  ctx.translate(w * 0.72, h * 0.5);

  // 3 Isometric Stacked Platform Blocks
  for (let b = 0; b < 3; b++) {
    const by = (b - 1) * 110;
    ctx.fillStyle = b === 1 ? "#F46A45" : "#18191E";
    ctx.strokeStyle = "#FF8662";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, by - 60);
    ctx.lineTo(180, by - 10);
    ctx.lineTo(0, by + 40);
    ctx.lineTo(-180, by - 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // Frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, w - 60, h - 60);
}

function renderPayPulseSocial(ctx, w, h) {
  // 1:1 Square Instagram Fintech Carousel Cover
  ctx.fillStyle = "#08090B";
  ctx.fillRect(0, 0, w, h);

  // Header pill
  ctx.fillStyle = "#18191E";
  ctx.fillRect(70, 70, 280, 50);
  ctx.strokeStyle = "rgba(244, 106, 69, 0.4)";
  ctx.strokeRect(70, 70, 280, 50);

  ctx.fillStyle = "#F46A45";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.fillText("FINTECH INSIGHTS // 04", 95, 102);

  // Slide Counter
  ctx.fillStyle = "#85858F";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "right";
  ctx.fillText("SLIDE 01 / 10", w - 70, 102);
  ctx.textAlign = "left";

  // Headline
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "900 52px 'Space Grotesk', sans-serif";
  ctx.fillText("DECENTRALIZED", 70, 280);
  ctx.fillText("PAYMENTS", 70, 345);
  ctx.fillStyle = "#F46A45";
  ctx.fillText("DEMIXED.", 70, 410);

  // Graphical Card Mockup in middle
  ctx.fillStyle = "#111216";
  ctx.fillRect(70, 480, w - 140, 360);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeRect(70, 480, w - 140, 360);

  // Inside Card Infographics
  ctx.fillStyle = "#F46A45";
  ctx.font = "bold 32px 'JetBrains Mono', monospace";
  ctx.fillText("$ 4,289,102.00", 110, 560);
  ctx.fillStyle = "#85858F";
  ctx.font = "14px 'Inter', sans-serif";
  ctx.fillText("Sub-second settlement across 24 global nodes", 110, 600);

  // Interactive Swipe Cue
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("SWIPE FOR NEXT INSIGHT →", w / 2, h - 80);
  ctx.textAlign = "left";
}

function renderTechFestBrochure(ctx, w, h) {
  // 4:3 Unfolded Tri-Fold Brochure Presentation
  ctx.fillStyle = "#0A0B0E";
  ctx.fillRect(0, 0, w, h);

  // 3 Equal Tri-Fold Panels
  const panelW = (w - 120) / 3;

  for (let i = 0; i < 3; i++) {
    const px = 60 + i * panelW;
    ctx.fillStyle = i === 1 ? "#111216" : "#0D0E12";
    ctx.fillRect(px, 60, panelW - 10, h - 120);

    ctx.strokeStyle = i === 1 ? "rgba(244, 106, 69, 0.4)" : "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    ctx.strokeRect(px, 60, panelW - 10, h - 120);

    // Panel Header
    ctx.fillStyle = "#F46A45";
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText(`PANEL 0${i + 1}`, px + 25, 110);
  }

  // Panel 1: Keynote Speakers
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "bold 24px 'Space Grotesk', sans-serif";
  ctx.fillText("SYMPOSIUM", 85, 160);
  ctx.fillStyle = "#85858F";
  ctx.font = "13px 'Inter', sans-serif";
  ctx.fillText("12 Distinguished Keynotes", 85, 195);
  ctx.fillText("Chittagong Research Council", 85, 220);

  // Panel 2: Center Fold Schedule
  ctx.fillStyle = "#F46A45";
  ctx.font = "900 28px 'Space Grotesk', sans-serif";
  ctx.fillText("IIUC TECHFEST", 60 + panelW + 25, 160);
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillText("DAY 1: ROBOTICS & AI", 60 + panelW + 25, 220);
  ctx.fillText("DAY 2: HACKATHON", 60 + panelW + 25, 260);
  ctx.fillText("DAY 3: SHOWCASE & GALA", 60 + panelW + 25, 300);

  // Panel 3: Registration & Map
  ctx.fillStyle = "#F5F3F0";
  ctx.font = "bold 24px 'Space Grotesk', sans-serif";
  ctx.fillText("VENUE & ENTRY", 60 + panelW * 2 + 25, 160);
  ctx.fillStyle = "#85858F";
  ctx.font = "13px 'Inter', sans-serif";
  ctx.fillText("Central Auditorium, IIUC", 60 + panelW * 2 + 25, 195);
  ctx.fillText("Kumira, Chittagong", 60 + panelW * 2 + 25, 220);
}

function renderGenericArtwork(ctx, w, h, id) {
  ctx.fillStyle = "#111216";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#F46A45";
  ctx.font = "bold 36px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`EXHIBIT // ${id.toUpperCase()}`, w / 2, h / 2);
}
