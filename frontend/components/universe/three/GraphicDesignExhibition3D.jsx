"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import gsap from "gsap";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Compass,
  Layers,
  Sparkles,
  Building,
  Calendar,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { createArtworkTexture } from "@/lib/three/textureGenerator";

const STATIONS = [
  {
    index: 0,
    code: "01",
    name: "Logo Design",
    slug: "logo-design",
    cameraZ: -1,
    description: "Geometric brandmarks, precision monograms & vector emblems.",
    exhibitIds: ["aura-monogram", "kromatik-esports"],
  },
  {
    index: 1,
    code: "02",
    name: "Brand Identity",
    slug: "brand-identity",
    cameraZ: -18,
    description: "Corporate visual standards, color matrices & stationery systems.",
    exhibitIds: ["vanguard-identity"],
  },
  {
    index: 2,
    code: "03",
    name: "Poster Design",
    slug: "poster-design",
    cameraZ: -35,
    description: "Silkscreen exhibition posters & asymmetric typographic art.",
    exhibitIds: ["bauhaus-poster", "cybernetics-poster"],
  },
  {
    index: 3,
    code: "04",
    name: "Banner Design",
    slug: "banner-design",
    cameraZ: -53,
    description: "16:9 widescreen launch headers & omnichannel ad suites.",
    exhibitIds: ["apex-banner"],
  },
  {
    index: 4,
    code: "05",
    name: "Social Media Design",
    slug: "social-media-design",
    cameraZ: -69,
    description: "High-retention 1:1 educational carousels & infographics.",
    exhibitIds: ["paypulse-social"],
  },
  {
    index: 5,
    code: "06",
    name: "Brochure & Print Design",
    slug: "brochure-print-design",
    cameraZ: -87,
    description: "CMYK offset print collateral & tri-fold conference guides.",
    exhibitIds: ["techfest-brochure"],
  },
];

const EXHIBITS = [
  {
    id: "aura-monogram",
    stationIndex: 0,
    title: "Aura Studio — Geometric Monogram System",
    category: "Logo Design",
    type: "logo",
    year: "2024",
    client: "Aura Spatial Lighting",
    shortDescription: "A precision-crafted geometric monogram constructed upon an 8-point isometric grid for an architectural lighting design studio.",
    longDescription: "Constructed upon a strict 8-point isometric grid, the Aura mark explores the tension between structural geometry and spatial diffusion. The logo family includes horizontal, stacked, and circular responsive lockups engineered for digital interfaces and architectural signage.",
    aspect: "1:1 Square",
    width: 3.2,
    height: 3.2,
    pos: [-5.4, 2.5, -4],
    rotY: Math.PI / 2,
    side: "left",
    tags: ["Monogram", "Isometric Grid", "Vector Craft", "Brandmark"],
  },
  {
    id: "kromatik-esports",
    stationIndex: 0,
    title: "Kromatik — Competitive Esports Insignia",
    category: "Logo Design",
    type: "logo",
    year: "2024",
    client: "Kromatik Gaming Club",
    shortDescription: "Aggressive, high-impact mascot insignia engineered for digital broadcasts, streaming overlays, and tournament apparel.",
    longDescription: "Developed for a regional competitive gaming organization. Combines dynamic angular motion lines with high-contrast dual-tone shading to ensure legibility across twitch avatar sizes (32px) and stage banners (4 meters).",
    aspect: "1:1 Square",
    width: 3.2,
    height: 3.2,
    pos: [5.4, 2.5, -8],
    rotY: -Math.PI / 2,
    side: "right",
    tags: ["Esports Emblem", "Vector Mascot", "Broadcast Graphics", "Apparel"],
  },
  {
    id: "vanguard-identity",
    stationIndex: 1,
    title: "Vanguard Systems — Corporate Identity & Standards",
    category: "Brand Identity",
    type: "brand-identity",
    year: "2023",
    client: "Vanguard Industrial Labs",
    shortDescription: "Comprehensive corporate identity manual, typography hierarchy, and corporate stationery standards for an engineering laboratory.",
    longDescription: "A complete visual identity program comprising custom wordmark design, corporate color system (obsidian, industrial orange, and aluminum), business stationery, envelope systems, employee badge guidelines, and a 42-page brand standards manual.",
    aspect: "16:9 Widescreen",
    width: 5.6,
    height: 3.15,
    pos: [-5.4, 2.6, -22],
    rotY: Math.PI / 2,
    side: "left",
    tags: ["Brand Identity", "Design System", "Stationery", "Corporate Guidelines"],
  },
  {
    id: "bauhaus-poster",
    stationIndex: 2,
    title: "Bauhaus & Constructivism — Spatial Architecture Poster",
    category: "Poster Design",
    type: "poster",
    year: "2024",
    client: "Chittagong Design Pavilion",
    shortDescription: "Experimental typographic poster exploring asymmetrical balance, diagonal grids, and mechanical minimalism.",
    longDescription: "Created as an homage to the Dessau Bauhaus and early Russian Constructivism. Features bold typographic hierarchies using grotesque typefaces, stark black/orange duotone contrasts, and layered architectural wireframes.",
    aspect: "3:4 Vertical",
    width: 2.6,
    height: 3.5,
    pos: [-5.4, 2.6, -37],
    rotY: Math.PI / 2,
    side: "left",
    tags: ["Typographic Poster", "Bauhaus", "Editorial", "Print Art"],
  },
  {
    id: "cybernetics-poster",
    stationIndex: 2,
    title: "Cybernetics 2030 — Speculative Future Series",
    category: "Poster Design",
    type: "poster",
    year: "2023",
    client: "IIUC Creative Exhibition",
    shortDescription: "Screen-printed exhibition poster series exploring algorithmic intelligence, fractal geometry, and cybernetic interfaces.",
    longDescription: "Exhibited at the International Islamic University Chittagong creative showcase. Combines mathematical fractal curves, circuit-inspired line art, and high-density technical typography.",
    aspect: "3:4 Vertical",
    width: 2.6,
    height: 3.5,
    pos: [5.4, 2.6, -41],
    rotY: -Math.PI / 2,
    side: "right",
    tags: ["Poster Series", "Speculative", "Screen Print", "Dark Aesthetic"],
  },
  {
    id: "apex-banner",
    stationIndex: 3,
    title: "Apex Cloud — Multi-Platform Launch Banner Suite",
    category: "Banner Design",
    type: "banner",
    year: "2024",
    client: "Apex Cloud Computing",
    shortDescription: "Omnichannel launch banners designed for web heroes, display advertising, Twitter headers, and LinkedIn company pages.",
    longDescription: "A cohesive digital ad campaign suite for a cloud developer tools startup. Designed across 12 standard IAB display ratios and social hero dimensions, prioritizing clear value proposition copy, isometric product mockups, and vibrant call-to-action framing.",
    aspect: "16:9 Widescreen",
    width: 5.6,
    height: 3.15,
    pos: [-5.4, 2.6, -57],
    rotY: Math.PI / 2,
    side: "left",
    tags: ["Web Banner", "Social Media Hero", "IAB Display Ads", "Digital Campaign"],
  },
  {
    id: "paypulse-social",
    stationIndex: 4,
    title: "PayPulse — Fintech Educational Carousel Kit",
    category: "Social Media Design",
    type: "social",
    year: "2024",
    client: "PayPulse Financial",
    shortDescription: "Swipeable 10-slide Instagram carousel series explaining decentralized payments, security, and sub-second settlement.",
    longDescription: "Created to boost educational engagement for a modern fintech company. The design system features modular 1:1 slide grids, data infographics, intuitive typographic hierarchy, and custom vector icons.",
    aspect: "1:1 Square",
    width: 3.4,
    height: 3.4,
    pos: [5.4, 2.5, -73],
    rotY: -Math.PI / 2,
    side: "right",
    tags: ["Social Carousel", "Infographic", "Instagram Kit", "Fintech"],
  },
  {
    id: "techfest-brochure",
    stationIndex: 5,
    title: "IIUC CSE TechFest — Official Tri-Fold Program Guide",
    category: "Brochure & Print Design",
    type: "brochure",
    year: "2023",
    client: "Department of CSE, IIUC",
    shortDescription: "Print-ready tri-fold brochure, event pass badges, and schedule collateral for the university annual technology symposium.",
    longDescription: "Engineered for high-volume commercial offset printing with 300 DPI CMYK color separation and spot-gloss varnish mapping. Features a clear 3-panel unfolding schedule, speaker profiles, and sponsor brand grid.",
    aspect: "4:3 Print Spread",
    width: 4.4,
    height: 3.1,
    pos: [-5.4, 2.5, -91],
    rotY: Math.PI / 2,
    side: "left",
    tags: ["Tri-Fold Brochure", "Print Production", "CMYK", "Event Collateral"],
  },
];

export default function GraphicDesignExhibition3D() {
  const mountRef = useRef(null);
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [approachedExhibit, setApproachedExhibit] = useState(null);
  const [hoveredExhibit, setHoveredExhibit] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const exhibitMeshesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const reqIdRef = useRef(null);

  // Navigate camera to a specific exhibition station
  const navigateToStation = useCallback((stationIdx) => {
    const station = STATIONS[stationIdx];
    if (!station || !cameraRef.current) return;

    setActiveStationIndex(stationIdx);
    setApproachedExhibit(null);
    setIsNavigating(true);

    const camera = cameraRef.current;
    gsap.to(camera.position, {
      x: 0,
      y: 2.2,
      z: station.cameraZ,
      duration: 1.3,
      ease: "power2.inOut",
      onComplete: () => {
        setIsNavigating(false);
      },
    });
  }, []);

  // Approach a specific artwork exhibit in 3D
  const approachArtwork = useCallback((exhibit) => {
    if (!cameraRef.current) return;
    setApproachedExhibit(exhibit);
    setIsNavigating(true);

    const camera = cameraRef.current;
    // Position camera 3.0 units in front of the artwork surface
    const targetX = exhibit.side === "left" ? exhibit.pos[0] + 3.0 : exhibit.pos[0] - 3.0;
    const targetY = exhibit.pos[1];
    const targetZ = exhibit.pos[2];

    gsap.to(camera.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1.1,
      ease: "power2.inOut",
      onComplete: () => {
        setIsNavigating(false);
      },
    });
  }, []);

  // Return from approached artwork back to current station standing position
  const returnToStation = useCallback(() => {
    navigateToStation(activeStationIndex);
  }, [navigateToStation, activeStationIndex]);

  // Deep-linking / auto-inspect URL parameter handling (e.g. ?exhibit=aura-monogram)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const exhibitParam = params.get("exhibit");
    if (exhibitParam) {
      const match = EXHIBITS.find((e) => e.id === exhibitParam);
      if (match) {
        setTimeout(() => {
          approachArtwork(match);
        }, 800);
      }
    }
  }, [approachArtwork]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (approachedExhibit) {
          returnToStation();
        }
      } else if (e.key === "ArrowRight" || e.key === "KeyD") {
        if (!approachedExhibit && activeStationIndex < STATIONS.length - 1) {
          navigateToStation(activeStationIndex + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "KeyA") {
        if (!approachedExhibit && activeStationIndex > 0) {
          navigateToStation(activeStationIndex - 1);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [approachedExhibit, activeStationIndex, navigateToStation, returnToStation]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090b);
    scene.fog = new THREE.FogExp2(0x08090b, 0.02);
    sceneRef.current = scene;

    // 2. Camera Setup (Standing at Station 01)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 150);
    camera.position.set(0, 2.2, -1);
    camera.lookAt(0, 2.2, -8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Enhanced Museum Lighting System
    const ambientLight = new THREE.AmbientLight(0x282932, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.2);
    dirLight.position.set(0, 10, -10);
    scene.add(dirLight);

    // 5. Gallery Architectural Corridor
    // Polished Floor
    const floorGeo = new THREE.PlaneGeometry(13, 115, 1, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e0f14,
      roughness: 0.22,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -52);
    scene.add(floor);

    // Glowing Orange Path Guide on Floor
    const pathGeo = new THREE.PlaneGeometry(0.2, 110);
    const pathMat = new THREE.MeshBasicMaterial({ color: 0xf46a45 });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.02, -52);
    scene.add(pathMesh);

    // Station Nodes on Floor
    STATIONS.forEach((st) => {
      const ringGeo = new THREE.RingGeometry(0.8, 1.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf46a45, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.03, st.cameraZ - 2);
      scene.add(ring);
    });

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(13, 115);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.9 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 6.2, -52);
    scene.add(ceiling);

    // Track Light Rods on Ceiling
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 115);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x303138, metalness: 0.9, roughness: 0.2 });
    const rodL = new THREE.Mesh(rodGeo, rodMat);
    rodL.rotation.x = Math.PI / 2;
    rodL.position.set(-3.5, 5.8, -52);
    scene.add(rodL);

    const rodR = new THREE.Mesh(rodGeo, rodMat);
    rodR.rotation.x = Math.PI / 2;
    rodR.position.set(3.5, 5.8, -52);
    scene.add(rodR);

    // Left Gallery Wall
    const leftWallGeo = new THREE.PlaneGeometry(115, 6.2);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x14151b, roughness: 0.7 });
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-5.8, 3.1, -52);
    scene.add(leftWall);

    // Right Gallery Wall
    const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(5.8, 3.1, -52);
    scene.add(rightWall);

    // 6. Station Architectural Banners
    STATIONS.forEach((station) => {
      const sCanvas = document.createElement("canvas");
      sCanvas.width = 1024;
      sCanvas.height = 140;
      const sCtx = sCanvas.getContext("2d");
      sCtx.fillStyle = "#0A0B0E";
      sCtx.fillRect(0, 0, 1024, 140);
      sCtx.strokeStyle = "#F46A45";
      sCtx.lineWidth = 5;
      sCtx.strokeRect(5, 5, 1014, 130);

      sCtx.fillStyle = "#F46A45";
      sCtx.font = "bold 28px 'JetBrains Mono', monospace";
      sCtx.fillText(`STATION ${station.code} // CHECKPOINT`, 40, 52);

      sCtx.fillStyle = "#F5F3F0";
      sCtx.font = "bold 46px 'Space Grotesk', sans-serif";
      sCtx.fillText(station.name.toUpperCase(), 40, 105);

      const sTex = new THREE.CanvasTexture(sCanvas);
      const sGeo = new THREE.PlaneGeometry(5.2, 0.75);
      const sMat = new THREE.MeshBasicMaterial({ map: sTex, side: THREE.DoubleSide });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.position.set(0, 5.1, station.cameraZ - 3);
      scene.add(sMesh);

      // Station Point Light
      const sLight = new THREE.PointLight(0xff8662, 2.6, 14, 1);
      sLight.position.set(0, 4.8, station.cameraZ);
      scene.add(sLight);
    });

    // 7. Mount Real 3D Artwork Exhibits
    const exhibitMeshes = [];

    EXHIBITS.forEach((exhibit) => {
      const exhibitGroup = new THREE.Group();
      exhibitGroup.position.set(...exhibit.pos);
      exhibitGroup.rotation.y = exhibit.rotY;

      // Frame Mount with Orange Bevel
      const frameGeo = new THREE.BoxGeometry(exhibit.width + 0.35, exhibit.height + 0.35, 0.14);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x18191e,
        emissive: 0xf46a45,
        emissiveIntensity: 0.1,
        roughness: 0.25,
        metalness: 0.8,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      exhibitGroup.add(frame);

      // Artwork Canvas Texture
      const artCanvas = createArtworkTexture(exhibit.type, exhibit.id);
      const artTex = new THREE.CanvasTexture(artCanvas);
      artTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const artGeo = new THREE.PlaneGeometry(exhibit.width, exhibit.height);
      const artMat = new THREE.MeshStandardMaterial({
        map: artTex,
        roughness: 0.25,
        metalness: 0.05,
      });
      const artMesh = new THREE.Mesh(artGeo, artMat);
      artMesh.position.z = 0.09;
      exhibitGroup.add(artMesh);

      // Dedicated Museum Spotlight
      const spot = new THREE.SpotLight(0xffedd5, 4.2, 9, Math.PI / 4, 0.4, 1);
      spot.position.set(0, 2.2, 2.4);
      spot.target = artMesh;
      exhibitGroup.add(spot);
      exhibitGroup.add(spot.target);

      // Floating Title Plaque below artwork
      const plaqueCanvas = document.createElement("canvas");
      plaqueCanvas.width = 512;
      plaqueCanvas.height = 96;
      const pCtx = plaqueCanvas.getContext("2d");
      pCtx.fillStyle = "#0D0E12";
      pCtx.fillRect(0, 0, 512, 96);
      pCtx.strokeStyle = "rgba(244, 106, 69, 0.6)";
      pCtx.strokeRect(3, 3, 506, 90);

      pCtx.fillStyle = "#F5F3F0";
      pCtx.font = "bold 26px 'Space Grotesk', sans-serif";
      pCtx.fillText(exhibit.title.split("—")[0].trim(), 20, 42);

      pCtx.fillStyle = "#F46A45";
      pCtx.font = "bold 16px 'JetBrains Mono', monospace";
      pCtx.fillText(`[CLICK TO INSPECT] · ${exhibit.year}`, 20, 76);

      const pTex = new THREE.CanvasTexture(plaqueCanvas);
      const pGeo = new THREE.PlaneGeometry(Math.min(exhibit.width, 3.2), 0.55);
      const pMat = new THREE.MeshBasicMaterial({ map: pTex });
      const plaqueMesh = new THREE.Mesh(pGeo, pMat);
      plaqueMesh.position.set(0, -(exhibit.height / 2 + 0.45), 0.09);
      exhibitGroup.add(plaqueMesh);

      exhibitGroup.userData = { exhibit, frame, artMesh, spot };
      scene.add(exhibitGroup);
      exhibitMeshes.push(exhibitGroup);
    });

    exhibitMeshesRef.current = exhibitMeshes;

    // 8. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      pointer.x = x;
      pointer.y = y;
      mouseRef.current.targetX = x * 0.7;
      mouseRef.current.targetY = y * 0.4;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(exhibitMeshes, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== scene) {
          root = root.parent;
        }
        if (root.userData?.exhibit) {
          container.style.cursor = "pointer";
          setHoveredExhibit(root.userData.exhibit);
          return;
        }
      }

      container.style.cursor = "default";
      setHoveredExhibit(null);
    };

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(exhibitMeshes, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== scene) {
          root = root.parent;
        }
        if (root.userData?.exhibit) {
          approachArtwork(root.userData.exhibit);
        }
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);

    // 9. Resize Handling
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // 10. Animation Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (!isNavigating && !approachedExhibit) {
        const station = STATIONS[activeStationIndex];
        const lookTargetZ = station ? station.cameraZ - 7 : -15;
        camera.lookAt(mouseRef.current.x * 2.8, 2.2 + mouseRef.current.y * 1.0, lookTargetZ);
      }

      // Hover highlight glow
      exhibitMeshes.forEach((em) => {
        const isHov = hoveredExhibit?.id === em.userData.exhibit.id;
        const isApp = approachedExhibit?.id === em.userData.exhibit.id;

        if (isApp) {
          em.userData.spot.intensity = 5.5;
          em.userData.frame.material.emissiveIntensity = 0.6;
        } else if (isHov) {
          em.userData.spot.intensity = 4.8;
          em.userData.frame.material.emissiveIntensity = 0.4;
        } else {
          em.userData.spot.intensity = 3.5;
          em.userData.frame.material.emissiveIntensity = 0.1;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);

      exhibitMeshes.forEach((em) => {
        em.traverse((child) => {
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
  }, [approachArtwork, approachedExhibit, isNavigating, hoveredExhibit, activeStationIndex]);

  const activeStation = STATIONS[activeStationIndex];

  return (
    <div className="relative w-screen h-screen bg-obsidian overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-obsidian/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/universe"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-obsidian/80 backdrop-blur-md text-xs font-mono text-mist hover:text-white hover:border-orange transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-orange" />
            <span>RETURN TO UNIVERSE HUB</span>
          </Link>
        </div>

        {/* Center Station Badge */}
        <div className="hidden md:flex flex-col items-center pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-orange uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
            <span>3D GRAPHIC DESIGN EXHIBITION</span>
          </div>
          <span className="text-sm font-display font-bold text-softwhite">
            {activeStation.name} · STATION {activeStation.code} / 06
          </span>
        </div>

        {/* Right Telemetry */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="hidden sm:inline-block px-3 py-1.5 rounded-full border border-white/10 bg-obsidian/80 backdrop-blur-md text-[11px] font-mono text-mist">
            USE [← / →] OR CLICK EXHIBIT
          </span>
        </div>
      </header>

      {/* Station Checkpoint Rail (Top-middle on Desktop) */}
      <nav
        className="absolute top-20 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 bg-obsidian/80 backdrop-blur-md border border-white/10 p-1.5 rounded-full pointer-events-auto shadow-xl"
        aria-label="3D Exhibition Stations"
      >
        {STATIONS.map((station, idx) => {
          const isActive = idx === activeStationIndex;
          return (
            <button
              key={station.slug}
              onClick={() => navigateToStation(idx)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-orange text-obsidian font-bold shadow-md shadow-orange/30"
                  : "text-mist hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{station.code}</span>
              <span>{station.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Station Navigation Arrows (Floating Left & Right) */}
      {!approachedExhibit && (
        <>
          {activeStationIndex > 0 && (
            <button
              onClick={() => navigateToStation(activeStationIndex - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-obsidian/80 backdrop-blur-md border border-white/15 text-softwhite hover:border-orange hover:bg-orange hover:text-obsidian transition-all shadow-xl"
              aria-label="Previous station"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {activeStationIndex < STATIONS.length - 1 && (
            <button
              onClick={() => navigateToStation(activeStationIndex + 1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-obsidian/80 backdrop-blur-md border border-white/15 text-softwhite hover:border-orange hover:bg-orange hover:text-obsidian transition-all shadow-xl"
              aria-label="Next station"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* Hover Information Banner (Bottom center when cursor is over artwork) */}
      {hoveredExhibit && !approachedExhibit && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto bg-obsidian/90 backdrop-blur-xl border border-orange/50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in">
          <div>
            <span className="text-[10px] font-mono text-orange uppercase tracking-wider block">
              {hoveredExhibit.category} · {hoveredExhibit.aspect}
            </span>
            <span className="text-base font-display font-bold text-softwhite">
              {hoveredExhibit.title}
            </span>
          </div>
          <button
            onClick={() => approachArtwork(hoveredExhibit)}
            className="px-4 py-2 rounded-xl bg-orange text-obsidian font-mono font-bold text-xs hover:bg-orange-light transition-all flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>APPROACH & INSPECT</span>
          </button>
        </div>
      )}

      {/* Sleek Inspection HUD Overlay (Opened when camera approaches artwork) */}
      {approachedExhibit && (
        <aside
          className="absolute top-20 right-6 bottom-6 w-full max-w-md z-30 bg-charcoal/95 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between animate-fade-in"
          role="dialog"
          aria-label="Artwork Details"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="px-2.5 py-1 rounded bg-orange/20 border border-orange/40 text-orange text-xs font-mono font-semibold uppercase">
                {approachedExhibit.category}
              </span>
              <button
                onClick={returnToStation}
                className="p-1.5 rounded-lg border border-white/10 text-mist hover:text-white hover:border-orange transition-all"
                aria-label="Return to gallery corridor (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Metadata */}
            <h2 className="text-2xl font-display font-bold text-softwhite mt-4 mb-2">
              {approachedExhibit.title}
            </h2>

            <div className="grid grid-cols-2 gap-3 py-3 my-3 border-y border-white/10 text-xs font-mono">
              <div>
                <span className="text-muted block text-[10px] uppercase">CLIENT / CONTEXT</span>
                <span className="text-softwhite font-medium flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-orange" />
                  {approachedExhibit.client}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">YEAR</span>
                <span className="text-softwhite font-medium flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-orange" />
                  {approachedExhibit.year}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">ASPECT RATIO</span>
                <span className="text-mist font-medium mt-0.5 block">
                  {approachedExhibit.aspect}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">SPATIAL ZONE</span>
                <span className="text-orange font-medium mt-0.5 block">
                  Station {STATIONS[approachedExhibit.stationIndex]?.code}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="my-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange block mb-2">
                EXHIBITION CONTEXT
              </span>
              <p className="text-mist text-sm leading-relaxed font-sans">
                {approachedExhibit.longDescription}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {approachedExhibit.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs font-mono bg-surface-100 text-mist border border-white/5"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={returnToStation}
              className="flex-1 py-2.5 px-4 rounded-xl bg-orange text-obsidian font-mono font-bold text-xs uppercase hover:bg-orange-light transition-all text-center"
            >
              ← RETURN TO CORRIDOR [ESC]
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Station Checkpoint Pills (Bottom of screen on mobile) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex md:hidden items-center justify-between bg-obsidian/90 backdrop-blur-md border border-white/10 p-2 rounded-xl">
        <button
          onClick={() => activeStationIndex > 0 && navigateToStation(activeStationIndex - 1)}
          disabled={activeStationIndex === 0}
          className="p-2 rounded-lg bg-surface-100 text-mist disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-softwhite">
          STATION {activeStation.code}: {activeStation.name}
        </span>
        <button
          onClick={() => activeStationIndex < STATIONS.length - 1 && navigateToStation(activeStationIndex + 1)}
          disabled={activeStationIndex === STATIONS.length - 1}
          className="p-2 rounded-lg bg-surface-100 text-mist disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
