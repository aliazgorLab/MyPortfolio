"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import gsap from "gsap";
import Link from "next/link";
import { ArrowLeft, Compass, Eye, Maximize2, Sparkles } from "lucide-react";
import { createArtworkTexture } from "@/lib/three/textureGenerator";

const WORLDS = [
  {
    code: "01",
    slug: "graphic-design",
    title: "GRAPHIC DESIGN",
    subtitle: "Brand Identity, Typography & Print",
    color: 0xf46a45,
    accentHex: "#F46A45",
    pos: [-11, 2.5, -8],
    rotY: 0.38,
    textureId: "aura-monogram",
    textureType: "logo",
    categorySummary: "Logos · Posters · Banners · Print",
  },
  {
    code: "02",
    slug: "ui-ux-design",
    title: "UI/UX DESIGN",
    subtitle: "Interfaces, Systems & Prototypes",
    color: 0xff8662,
    accentHex: "#FF8662",
    pos: [-4, 2.5, -15],
    rotY: 0.12,
    textureId: "vanguard-identity",
    textureType: "brand-identity",
    categorySummary: "Web UI · Apps · Design Systems",
  },
  {
    code: "03",
    slug: "web-development",
    title: "WEB DEVELOPMENT",
    subtitle: "Software Systems & Full-Stack",
    color: 0xe65a32,
    accentHex: "#E65A32",
    pos: [4, 2.5, -15],
    rotY: -0.12,
    textureId: "cybernetics-poster",
    textureType: "poster",
    categorySummary: "Web Apps · APIs · Tools",
  },
  {
    code: "04",
    slug: "video-motion",
    title: "VIDEO & MOTION",
    subtitle: "Motion Graphics & Showreels",
    color: 0x9b3825,
    accentHex: "#9B3825",
    pos: [11, 2.5, -8],
    rotY: -0.38,
    textureId: "apex-banner",
    textureType: "banner",
    categorySummary: "Promos · Motion · Showreels",
  },
];

export default function UniverseHub3D({ isCompactSection = false }) {
  const mountRef = useRef(null);
  const router = useRouter();
  const [hoveredWorld, setHoveredWorld] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // References to keep across re-renders
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const portalsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const reqIdRef = useRef(null);

  const handlePortalSelect = useCallback((world) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const camera = cameraRef.current;
    if (camera) {
      // Smooth camera rush towards the portal
      gsap.to(camera.position, {
        x: world.pos[0] * 0.8,
        y: world.pos[1],
        z: world.pos[2] + 2.5,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(`/universe/${world.slug}`);
        },
      });
    } else {
      router.push(`/universe/${world.slug}`);
    }
  }, [isTransitioning, router]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090b);
    scene.fog = new THREE.FogExp2(0x08090b, 0.022);
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (isCompactSection ? 600 : window.innerHeight);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 8);
    camera.lookAt(0, 2.8, -10);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0x18191e, 1.2);
    scene.add(ambientLight);

    const centerSpot = new THREE.SpotLight(0xff8662, 2.5, 40, Math.PI / 4, 0.5, 1);
    centerSpot.position.set(0, 15, 0);
    centerSpot.target.position.set(0, 0, -10);
    scene.add(centerSpot);
    scene.add(centerSpot.target);

    // 5. Reflective Sci-Fi Grid Floor
    const floorGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d12,
      roughness: 0.35,
      metalness: 0.7,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Grid Wireframe Overlay
    const gridHelper = new THREE.GridHelper(80, 40, 0xf46a45, 0x18191e);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 6. Monumental Architectural Columns
    const colGeo = new THREE.BoxGeometry(1.4, 14, 1.4);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x111216, roughness: 0.7, metalness: 0.3 });

    const columnPositions = [
      [-18, 7, -2],
      [-18, 7, -18],
      [18, 7, -2],
      [18, 7, -18],
      [-6, 7, -24],
      [6, 7, -24],
    ];

    columnPositions.forEach(([cx, cy, cz]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, cy, cz);
      col.castShadow = true;
      scene.add(col);

      // Vertical Orange Glow Strip on each column
      const stripGeo = new THREE.PlaneGeometry(0.12, 10);
      const stripMat = new THREE.MeshBasicMaterial({ color: 0xf46a45, side: THREE.DoubleSide });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(cx > 0 ? cx - 0.71 : cx + 0.71, cy - 1, cz);
      strip.rotation.y = Math.PI / 2;
      scene.add(strip);
    });

    // 7. Four Monumental World Portals
    const portals = [];

    WORLDS.forEach((world) => {
      const portalGroup = new THREE.Group();
      portalGroup.position.set(...world.pos);
      portalGroup.rotation.y = world.rotY;

      // A. Outer Architectural Monolith Arch
      const archOuterGeo = new THREE.BoxGeometry(4.8, 6.2, 0.6);
      const archOuterMat = new THREE.MeshStandardMaterial({
        color: 0x111216,
        roughness: 0.4,
        metalness: 0.8,
      });
      const archOuter = new THREE.Mesh(archOuterGeo, archOuterMat);
      portalGroup.add(archOuter);

      // B. Inner Glowing Energy Frame
      const frameGeo = new THREE.BoxGeometry(4.2, 5.4, 0.7);
      const frameMat = new THREE.MeshStandardMaterial({
        color: world.color,
        emissive: world.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      portalGroup.add(frame);

      // C. Artwork Display Canvas
      const canvasTexture = createArtworkTexture(world.textureType, world.textureId);
      const texture = new THREE.CanvasTexture(canvasTexture);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const artworkGeo = new THREE.PlaneGeometry(3.6, 4.6);
      const artworkMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
      });
      const artworkMesh = new THREE.Mesh(artworkGeo, artworkMat);
      artworkMesh.position.z = 0.38;
      portalGroup.add(artworkMesh);

      // D. Point Light Illuminating This Portal Area
      const pLight = new THREE.PointLight(world.color, 2.5, 12, 1.2);
      pLight.position.set(0, 0, 1.5);
      portalGroup.add(pLight);

      // E. Typographic Billboard Plane (Title above arch)
      const titleCanvas = document.createElement("canvas");
      titleCanvas.width = 512;
      titleCanvas.height = 128;
      const tCtx = titleCanvas.getContext("2d");
      tCtx.fillStyle = "#08090B";
      tCtx.fillRect(0, 0, 512, 128);
      tCtx.strokeStyle = world.accentHex;
      tCtx.lineWidth = 4;
      tCtx.strokeRect(4, 4, 504, 120);

      tCtx.fillStyle = "#F5F3F0";
      tCtx.font = "bold 34px 'Space Grotesk', sans-serif";
      tCtx.textAlign = "center";
      tCtx.fillText(`${world.code} // ${world.title}`, 256, 56);

      tCtx.fillStyle = world.accentHex;
      tCtx.font = "600 16px 'JetBrains Mono', monospace";
      tCtx.letterSpacing = "0.2em";
      tCtx.fillText("CLICK TO ENTER WORLD", 256, 92);

      const titleTex = new THREE.CanvasTexture(titleCanvas);
      const titleGeo = new THREE.PlaneGeometry(3.8, 0.95);
      const titleMat = new THREE.MeshBasicMaterial({ map: titleTex, side: THREE.DoubleSide });
      const titleMesh = new THREE.Mesh(titleGeo, titleMat);
      titleMesh.position.set(0, 3.6, 0.4);
      portalGroup.add(titleMesh);

      // Save references for raycasting and hover
      portalGroup.userData = { world, frame, pLight, artworkMesh, baseRotY: world.rotY };
      scene.add(portalGroup);
      portals.push(portalGroup);
    });

    portalsRef.current = portals;
    setIsReady(true);

    // 8. Pointer / Mouse Interaction & Parallax
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      pointer.x = x;
      pointer.y = y;
      mouseRef.current.targetX = x * 1.5;
      mouseRef.current.targetY = y * 0.8;

      // Raycast against portals
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(portals, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== scene) {
          root = root.parent;
        }
        if (root.userData?.world) {
          container.style.cursor = "pointer";
          setHoveredWorld(root.userData.world);
          return;
        }
      }

      container.style.cursor = "default";
      setHoveredWorld(null);
    };

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(portals, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== scene) {
          root = root.parent;
        }
        if (root.userData?.world) {
          handlePortalSelect(root.userData.world);
        }
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);

    // 9. Resize Handling
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (isCompactSection ? 600 : window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (!isTransitioning) {
        camera.position.x = mouseRef.current.x * 0.8;
        camera.position.y = 3.2 + mouseRef.current.y * 0.3;
        camera.lookAt(0, 2.5, -12);
      }

      // Animate portals: gentle floating & pulsing glow
      portals.forEach((p, idx) => {
        const isHovered = hoveredWorld?.slug === p.userData.world.slug;
        const targetY = isHovered ? p.userData.world.pos[1] + 0.3 : p.userData.world.pos[1] + Math.sin(elapsed * 1.5 + idx) * 0.08;
        p.position.y += (targetY - p.position.y) * 0.1;

        if (isHovered) {
          p.userData.frame.material.emissiveIntensity = 0.9 + Math.sin(elapsed * 6) * 0.2;
          p.userData.pLight.intensity = 4.0;
        } else {
          p.userData.frame.material.emissiveIntensity = 0.3 + Math.sin(elapsed * 2 + idx) * 0.1;
          p.userData.pLight.intensity = 2.2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);

      portals.forEach((p) => {
        p.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
            else child.material.dispose();
          }
        });
      });

      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
    };
  }, [handlePortalSelect, isCompactSection, hoveredWorld]);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-obsidian overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-obsidian/80 backdrop-blur-md text-xs font-mono text-mist hover:text-white hover:border-orange transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange" />
            <span>EXIT 3D HUB</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-obsidian/80 backdrop-blur-md text-[11px] font-mono text-orange uppercase">
            <span className="w-2 h-2 rounded-full bg-orange animate-ping" />
            <span>3D SPATIAL EXPLORATION ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Bottom Center Telemetry Pill */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        {hoveredWorld ? (
          <div className="pointer-events-auto inline-flex flex-col items-center bg-obsidian/90 backdrop-blur-xl border border-orange/50 px-6 py-3 rounded-2xl shadow-2xl shadow-orange/20 animate-fade-in">
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange uppercase">
              PORTAL READY // {hoveredWorld.code}
            </span>
            <span className="text-xl sm:text-2xl font-display font-bold text-softwhite">
              {hoveredWorld.title}
            </span>
            <span className="text-xs font-mono text-mist/80 mt-0.5">
              {hoveredWorld.categorySummary}
            </span>
            <button
              onClick={() => handlePortalSelect(hoveredWorld)}
              className="mt-2.5 px-4 py-1.5 rounded-full bg-orange text-obsidian font-mono font-bold text-xs uppercase hover:bg-orange-light transition-all pointer-events-auto"
            >
              CLICK OR TAP TO ENTER →
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-obsidian/75 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-mist">
            <Compass className="w-3.5 h-3.5 text-orange animate-spin-slow" />
            <span>Move cursor to look around · Click any 3D portal to enter</span>
          </div>
        )}
      </div>

      {/* Fast Portal Switcher Shelf (Bottom Left on Desktop) */}
      <div className="absolute bottom-6 left-6 z-20 hidden lg:flex flex-col gap-1.5 pointer-events-auto">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
          FAST PORTAL JUMP:
        </span>
        <div className="flex gap-2">
          {WORLDS.map((w) => (
            <button
              key={w.slug}
              onClick={() => handlePortalSelect(w)}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-charcoal/80 backdrop-blur-md text-xs font-mono text-mist hover:text-white hover:border-orange hover:bg-surface-elevated transition-all"
            >
              <span className="text-orange">{w.code}</span> {w.slug.split("-")[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
