'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Food3DViewerProps {
  modelType?: 'burger' | 'coffee' | 'dosa' | 'tray';
  className?: string;
  autoRotate?: boolean;
}

export function Food3DViewer({
  modelType = 'burger',
  className = 'w-full h-[320px]',
  autoRotate = true,
}: Food3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffb347, 2.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x00d4aa, 2.0);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const topRimLight = new THREE.PointLight(0xff6b2c, 3.5, 10);
    topRimLight.position.set(0, 3, 2);
    scene.add(topRimLight);

    // 5. 3D Model Group Construction
    const foodGroup = new THREE.Group();

    if (modelType === 'burger') {
      // --- 🍔 PROCEDURAL 3D DELUXE BURGER ---
      // Top Bun
      const topBunGeo = new THREE.SphereGeometry(1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const bunMat = new THREE.MeshStandardMaterial({
        color: 0xd97724,
        roughness: 0.35,
        metalness: 0.05,
      });
      const topBun = new THREE.Mesh(topBunGeo, bunMat);
      topBun.scale.set(1.05, 0.65, 1.05);
      topBun.position.y = 0.45;
      foodGroup.add(topBun);

      // Sesame Seeds on top bun
      const seedGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xffeedd, roughness: 0.2 });
      for (let i = 0; i < 28; i++) {
        const seed = new THREE.Mesh(seedGeo, seedMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI / 3.5);
        const r = 1.08;
        seed.position.x = r * Math.sin(phi) * Math.cos(theta) * 1.05;
        seed.position.y = 0.45 + r * Math.cos(phi) * 0.65;
        seed.position.z = r * Math.sin(phi) * Math.sin(theta) * 1.05;
        seed.scale.set(1, 0.4, 1.5);
        seed.rotation.y = theta;
        foodGroup.add(seed);
      }

      // Fresh Lettuce
      const lettuceGeo = new THREE.CylinderGeometry(1.18, 1.15, 0.08, 16);
      const lettuceMat = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        roughness: 0.6,
      });
      const lettuce = new THREE.Mesh(lettuceGeo, lettuceMat);
      lettuce.position.y = 0.35;
      foodGroup.add(lettuce);

      // Tomato Slices
      const tomatoGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.1, 24);
      const tomatoMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.2,
      });
      const tomato = new THREE.Mesh(tomatoGeo, tomatoMat);
      tomato.position.y = 0.22;
      foodGroup.add(tomato);

      // Melting Cheese Slice (Angled square)
      const cheeseGeo = new THREE.BoxGeometry(1.65, 0.04, 1.65);
      const cheeseMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.3,
        metalness: 0.1,
      });
      const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
      cheese.position.y = 0.1;
      cheese.rotation.y = Math.PI / 4;
      foodGroup.add(cheese);

      // Grilled Crispy Patty
      const pattyGeo = new THREE.CylinderGeometry(1.12, 1.12, 0.3, 32);
      const pattyMat = new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.85,
        metalness: 0.1,
      });
      const patty = new THREE.Mesh(pattyGeo, pattyMat);
      patty.position.y = -0.1;
      foodGroup.add(patty);

      // Bottom Bun
      const botBunGeo = new THREE.CylinderGeometry(1.05, 0.95, 0.35, 32);
      const botBun = new THREE.Mesh(botBunGeo, bunMat);
      botBun.position.y = -0.42;
      foodGroup.add(botBun);
    } else if (modelType === 'coffee') {
      // --- ☕ 3D GOURMET COFFEE CUP ---
      // Cup Body
      const cupGeo = new THREE.CylinderGeometry(0.85, 0.6, 1.4, 32);
      const cupMat = new THREE.MeshStandardMaterial({
        color: 0x16161e,
        roughness: 0.1,
        metalness: 0.3,
      });
      const cup = new THREE.Mesh(cupGeo, cupMat);
      foodGroup.add(cup);

      // Sleeve
      const sleeveGeo = new THREE.CylinderGeometry(0.86, 0.72, 0.6, 32);
      const sleeveMat = new THREE.MeshStandardMaterial({
        color: 0xff6b2c,
        roughness: 0.7,
      });
      const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
      sleeve.position.y = 0.05;
      foodGroup.add(sleeve);

      // Coffee Liquid
      const liquidGeo = new THREE.CircleGeometry(0.8, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0x3e2723,
        roughness: 0.1,
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.rotation.x = -Math.PI / 2;
      liquid.position.y = 0.68;
      foodGroup.add(liquid);

      // Foam Art Heart
      const foamGeo = new THREE.CircleGeometry(0.35, 16);
      const foamMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.4 });
      const foam = new THREE.Mesh(foamGeo, foamMat);
      foam.rotation.x = -Math.PI / 2;
      foam.position.y = 0.685;
      foodGroup.add(foam);
    } else {
      // --- 🥞 3D GOLDEN CRISPY DOSA / ROLL ---
      const rollGeo = new THREE.CylinderGeometry(0.38, 0.38, 2.4, 32);
      const rollMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.4,
        metalness: 0.05,
      });
      const roll = new THREE.Mesh(rollGeo, rollMat);
      roll.rotation.z = Math.PI / 2;
      foodGroup.add(roll);

      // Chutney Bowl
      const bowlGeo = new THREE.CylinderGeometry(0.45, 0.3, 0.35, 24);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0x00d4aa, roughness: 0.2 });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.set(-0.7, -0.4, 0.6);
      foodGroup.add(bowl);
    }

    // Glowing Holographic Base Pedestal Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.85;
    foodGroup.add(ring);

    // Floating Steam Particles
    const particleCount = 20;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 1.2;
      particlePositions[i + 1] = 0.6 + Math.random() * 1.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 1.2;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
    });
    const steamParticles = new THREE.Points(particlesGeo, particleMat);
    foodGroup.add(steamParticles);

    scene.add(foodGroup);

    // 6. Interactive Mouse Drag & Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousMousePosition = { x: clientX, y: clientY };
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = ((clientX - rect.left) / width) * 2 - 1;
        mouseY = -(((clientY - rect.top) / height) * 2 - 1);
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Render Loop with Inertia & Floating Physics
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating levitation
      foodGroup.position.y = Math.sin(elapsedTime * 2) * 0.08;

      // Auto-rotation when not dragging
      if (autoRotate && !isDragging) {
        targetRotationY += 0.008;
      }

      // Smooth inertia lerp
      foodGroup.rotation.y += (targetRotationY - foodGroup.rotation.y) * 0.08;
      foodGroup.rotation.x += (targetRotationX + mouseY * 0.2 - foodGroup.rotation.x) * 0.08;
      foodGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.04;

      // Rotate hologram ring
      ring.rotation.z += 0.015;

      // Animate steam particles rising
      const pos = particlesGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += 0.005;
        if (pos[i] > 1.8) pos[i] = 0.6;
      }
      particlesGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Window Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType, autoRotate]);

  return (
    <div className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-400 pointer-events-none flex items-center gap-1.5 shadow-lg">
        <span>✨</span>
        <span>{isInteracting ? 'Rotating 3D Model' : 'Drag to Rotate 360°'}</span>
      </div>
    </div>
  );
}
