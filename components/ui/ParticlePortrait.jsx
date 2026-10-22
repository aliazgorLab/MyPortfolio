"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * ParticlePortrait — Organic Material Dissolution Canvas Renderer
 * Inspired by Reference 2 (fine physical disintegration into the surrounding air):
 * - Samples authentic RGB pixel colors from hero_image.png
 * - Contrast-aware particles: dark hair & glasses get a luminous silver-cyan edge lift to remain visible against obsidian
 * - Microscopic particle fragments (1–3px dust, 3–5px flecks) with tumbling rotation
 * - Organic, non-circular, ragged erosion field (NO circular or radar outlines)
 * - Upward atmospheric drift + horizontal air turbulence
 * - Seamless self-healing recovery when pointer departs
 * - 100% native browser cursor preserved everywhere
 */
export default function ParticlePortrait({
  src = "/images/hero_image.png",
  alt = "Md Ali Azgor — Creative Developer & UI/UX Designer",
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 1. Accessibility & device detection
    // Only disable if device ONLY has touch and NO mouse/trackpad hover capability
    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isTouchOnly || prefersReduced) {
      return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) {
      setHasError(true);
      return;
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Headroom (in CSS px) above portrait for particle ascension into the atmosphere
    const HEADROOM = 110;
    const HORIZ_PAD = 45;

    // 2. Offscreen sampling buffer for instant O(1) pixel color lookup
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const SAMPLE_W = 835;
    const SAMPLE_H = 470;
    sampleCanvas.width = SAMPLE_W;
    sampleCanvas.height = SAMPLE_H;

    let pixelData = null;
    let imageLoaded = false;

    // 3. Offscreen mask canvas (white = intact portrait, transparent = dissolved hole)
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");

    // 4. Particle system state
    const particles = [];
    const MAX_PARTICLES = 2800;

    let isHovering = false;
    let mouseX = -9999;
    let mouseY = -9999;
    let lastMouseX = -9999;
    let lastMouseY = -9999;
    let mouseSpeed = 0;
    let mouseVx = 0;
    let mouseVy = 0;

    let isFullyHealed = true;
    let healCounter = 60;
    let rafId = null;

    const setupMask = () => {
      const bufferW = Math.max(1, Math.round((width + HORIZ_PAD * 2) * dpr));
      const bufferH = Math.max(1, Math.round((height + HEADROOM) * dpr));

      maskCanvas.width = bufferW;
      maskCanvas.height = bufferH;
      maskCtx.fillStyle = "#ffffff";
      maskCtx.fillRect(0, 0, bufferW, bufferH);

      isFullyHealed = true;
      healCounter = 60;
    };

    const resize = () => {
      if (!container || !canvas) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW <= 0 || newH <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = newW;
      height = newH;

      const bufferW = Math.round((width + HORIZ_PAD * 2) * dpr);
      const bufferH = Math.round((height + HEADROOM) * dpr);

      canvas.width = bufferW;
      canvas.height = bufferH;
      canvas.style.width = `${width + HORIZ_PAD * 2}px`;
      canvas.style.height = `${height + HEADROOM}px`;
      canvas.style.top = `-${HEADROOM}px`;
      canvas.style.left = `-${HORIZ_PAD}px`;

      setupMask();
      renderStatic();
    };

    // Render single static intact frame
    const renderStatic = () => {
      if (!imageLoaded || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const destX = Math.round(HORIZ_PAD * dpr);
      const destY = Math.round(HEADROOM * dpr);
      const destW = Math.round(width * dpr);
      const destH = Math.round(height * dpr);
      ctx.drawImage(img, destX, destY, destW, destH);
    };

    // Load source image
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    const onImageReady = () => {
      try {
        sampleCtx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
        const imgData = sampleCtx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);
        pixelData = imgData.data;
        imageLoaded = true;
        setIsReady(true);
        resize();
      } catch (err) {
        console.warn("Portrait canvas sampling fallback:", err);
        setHasError(true);
      }
    };

    img.onload = onImageReady;
    img.onerror = () => {
      setHasError(true);
    };
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      onImageReady();
    }

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(container);

    // Color sampler: normalized coordinates (u, v) -> { r, g, b, a }
    const sampleColor = (u, v) => {
      if (!pixelData) return null;
      const sx = Math.floor(Math.max(0, Math.min(1, u)) * (SAMPLE_W - 1));
      const sy = Math.floor(Math.max(0, Math.min(1, v)) * (SAMPLE_H - 1));
      const idx = (sy * SAMPLE_W + sx) * 4;
      const a = pixelData[idx + 3];
      if (a < 18) return null; // Transparent PNG background

      let r = pixelData[idx];
      let g = pixelData[idx + 1];
      let b = pixelData[idx + 2];

      // Contrast enhancement: if pixel is very dark (hair, sunglasses, shadows),
      // give it a subtle luminous silver-cyan lift so tiny particles are visible against dark obsidian
      const luminance = r * 0.299 + g * 0.587 + b * 0.114;
      if (luminance < 70) {
        const lift = (70 - luminance) * 0.75;
        r = Math.min(255, Math.round(r + lift * 0.6));
        g = Math.min(255, Math.round(g + lift * 0.85));
        b = Math.min(255, Math.round(b + lift * 1.25)); // luminous cyan-silver fleck
      }

      return {
        r,
        g,
        b,
        a: a / 255,
      };
    };

    // Organic erosion function: stamps irregular micro-splatters (NOT a circle)
    const erodeMask = (cx, cy) => {
      const bufferCx = (cx + HORIZ_PAD) * dpr;
      const bufferCy = (cy + HEADROOM) * dpr;
      const baseRadius = 62 * dpr;
      const bSplatterCount = 42 + Math.floor(Math.random() * 24);

      maskCtx.save();
      maskCtx.globalCompositeOperation = "destination-out";

      for (let i = 0; i < bSplatterCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Non-uniform distance distribution with organic noise harmonics
        const rNorm = Math.pow(Math.random(), 0.58);
        const noise =
          0.62 +
          0.28 * Math.sin(angle * 4 + cx * 0.04) * Math.cos(angle * 3 - cy * 0.05) +
          0.14 * Math.sin(angle * 6);
        const dist = baseRadius * rNorm * noise;

        const px = bufferCx + Math.cos(angle) * dist;
        const py = bufferCy + Math.sin(angle) * dist;

        if (px < 0 || px >= maskCanvas.width || py < 0 || py >= maskCanvas.height) {
          continue;
        }

        // Varied rectangular erosion flecks
        const speckSize = (2.2 + Math.random() * 6.5 * (1 - dist / baseRadius)) * dpr;
        const alpha = Math.min(
          1,
          (0.48 + Math.random() * 0.52) * (1 - (dist / baseRadius) * 0.35)
        );

        maskCtx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(2)})`;
        maskCtx.fillRect(
          px - speckSize / 2,
          py - speckSize / 2,
          speckSize,
          speckSize
        );
      }

      maskCtx.restore();
      isFullyHealed = false;
      healCounter = 0;
    };

    // Spawn fine material particles from sampled pixels in the active erosion zone
    const spawnParticles = (cx, cy) => {
      if (!pixelData) return;
      const count = isHovering
        ? Math.min(48, Math.floor(18 + mouseSpeed * 1.3))
        : 0;

      const spawnRadius = 58; // px

      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break;

        const angle = Math.random() * Math.PI * 2;
        const rNorm = Math.pow(Math.random(), 0.52);
        const dist = spawnRadius * rNorm * (0.75 + 0.25 * Math.sin(angle * 5));

        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;

        if (px < 0 || px >= width || py < 0 || py >= height) continue;

        const u = px / width;
        const v = py / height;
        const sample = sampleColor(u, v);
        if (!sample) continue;

        // Particle size distribution matching Reference 2:
        // ~65% fine dust (1.1–2.2px), ~28% medium fragments (2.2–3.8px), ~7% texture flecks (3.8–5.2px)
        const randType = Math.random();
        let size = 1.1 + Math.random() * 1.3;
        if (randType > 0.65) size = 2.3 + Math.random() * 1.6;
        if (randType > 0.93) size = 3.8 + Math.random() * 1.5;

        // Aspect ratio variation (micro-geometric chips)
        const aspect = 0.72 + Math.random() * 0.56;

        // Kinematics matching Reference 2:
        // Outward dispersion away from cursor
        const outAngle = Math.atan2(py - cy, px - cx);
        const outSpeed = 0.45 + Math.random() * 1.4;

        // Dominant upward drift (ash/dust floating high into the air)
        const upwardSpeed = -1.4 - Math.random() * 2.8;
        const flutter = (Math.random() - 0.5) * 1.3;

        const vx = Math.cos(outAngle) * outSpeed * 0.6 + flutter + mouseVx * 0.15;
        const vy = upwardSpeed + Math.sin(outAngle) * outSpeed * 0.3;

        const bufferPx = (px + HORIZ_PAD) * dpr;
        const bufferPy = (py + HEADROOM) * dpr;

        particles.push({
          x: bufferPx,
          y: bufferPy,
          vx: vx * dpr,
          vy: vy * dpr,
          r: sample.r,
          g: sample.g,
          b: sample.b,
          baseAlpha: sample.a,
          sizeW: size * dpr,
          sizeH: size * aspect * dpr,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.08,
          life: 1.0,
          decay: 0.009 + Math.random() * 0.015, // Lifespan ~50–95 frames (1 to 1.6s)
          gravity: -0.018 * dpr, // Buoyant upward lift
          drag: 0.972, // Air resistance
          flutterPhase: Math.random() * Math.PI * 2,
          flutterSpeed: 0.05 + Math.random() * 0.07,
          flutterAmp: (0.35 + Math.random() * 0.65) * dpr,
        });
      }
    };

    // Pointer event handlers
    const updateCoords = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseVx = x - lastMouseX;
      mouseVy = y - lastMouseY;
      mouseSpeed = Math.hypot(mouseVx, mouseVy);

      lastMouseX = x;
      lastMouseY = y;
      mouseX = x;
      mouseY = y;
    };

    const handlePointerEnter = (e) => {
      isHovering = true;
      updateCoords(e);
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      startLoop();
    };

    const handlePointerMove = (e) => {
      isHovering = true;
      updateCoords(e);
      startLoop();
    };

    const handlePointerLeave = () => {
      isHovering = false;
      mouseX = -9999;
      mouseY = -9999;
      mouseSpeed = 0;
      mouseVx = 0;
      mouseVy = 0;
    };

    // Listen on both container and canvas for maximum responsiveness
    container.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    canvas.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
    canvas.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // Main animation loop
    const tick = () => {
      if (!imageLoaded || !ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // 1. Process active hover dissolution & particle spawning
      if (isHovering && mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
        erodeMask(mouseX, mouseY);
        spawnParticles(mouseX, mouseY);
      }

      // 2. Self-healing mask pass (smooth organic restoration)
      if (!isFullyHealed) {
        maskCtx.save();
        maskCtx.globalCompositeOperation = "source-over";
        const healRate = isHovering ? 0.024 : 0.058;
        maskCtx.fillStyle = `rgba(255, 255, 255, ${healRate})`;
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.restore();

        healCounter++;
        if (!isHovering && healCounter > 50) {
          isFullyHealed = true;
          maskCtx.fillStyle = "#ffffff";
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        }
      }

      // 3. Clear display canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Draw base portrait image at exact destination
      const destX = Math.round(HORIZ_PAD * dpr);
      const destY = Math.round(HEADROOM * dpr);
      const destW = Math.round(width * dpr);
      const destH = Math.round(height * dpr);
      ctx.drawImage(img, destX, destY, destW, destH);

      // 5. Apply organic dissolution mask (destination-in)
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);

      // 6. Draw flying particle fragments (source-over)
      ctx.globalCompositeOperation = "source-over";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics updates
        p.vx *= p.drag;
        p.vy += p.gravity;
        p.vy *= p.drag;

        p.flutterPhase += p.flutterSpeed;
        const sway = Math.sin(p.flutterPhase) * p.flutterAmp;

        p.x += p.vx + sway;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life * p.baseAlpha);
        const curScale = 0.35 + 0.65 * p.life;
        const curW = Math.max(0.8, p.sizeW * curScale);
        const curH = Math.max(0.8, p.sizeH * curScale);

        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha.toFixed(2)})`;

        // Micro-fragment with tumbling rotation
        if (p.sizeW > 2.5 * dpr) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-curW / 2, -curH / 2, curW, curH);
          ctx.restore();
        } else {
          ctx.fillRect(p.x - curW / 2, p.y - curH / 2, curW, curH);
        }
      }

      // 7. Check if animation should sleep (0% CPU when idle)
      if (!isHovering && particles.length === 0 && isFullyHealed) {
        renderStatic();
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    return () => {
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerenter", handlePointerEnter);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none pointer-events-auto ${className}`}
    >
      {/* Sizing anchor image maintains exact natural layout proportions */}
      <Image
        src={src}
        alt={alt}
        width={1670}
        height={941}
        priority
        quality={90}
        className={`w-full h-auto object-contain object-center select-none pointer-events-none transition-opacity duration-300 ${
          isReady && !hasError ? "opacity-0" : "opacity-100"
        }`}
        draggable={false}
      />

      {/* Interactive Organic Particle Dissolution Canvas */}
      {!hasError && (
        <canvas
          ref={canvasRef}
          className={`absolute select-none block transition-opacity duration-300 pointer-events-auto cursor-default ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
