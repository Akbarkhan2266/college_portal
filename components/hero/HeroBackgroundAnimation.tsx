"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const GOLD_PALETTE = [
  "rgba(238, 191, 113,", // #eebf71
  "rgba(212, 175, 55,",  // #d4af37
  "rgba(255, 222, 170,", // #ffdeaa
  "rgba(180, 138, 60,",  // #b48a3c
  "rgba(255, 248, 220,", // #fff8dc
];

export default function HeroBackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000, radius: 140 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen width
      const count = width < 768 ? 38 : 75;

      for (let i = 0; i < count; i++) {
        const colorPrefix = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius: Math.random() * 2 + 1,
          color: colorPrefix,
          alpha: Math.random() * 0.6 + 0.3,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const maxLineDistance = 130;
    const maxLineDistanceSq = maxLineDistance * maxLineDistance;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background geometric ambient glows
      const grad = ctx.createRadialGradient(
        width * 0.35, height * 0.4, 10,
        width * 0.35, height * 0.4, width * 0.55
      );
      grad.addColorStop(0, "rgba(238, 191, 113, 0.06)");
      grad.addColorStop(0.5, "rgba(180, 138, 60, 0.03)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundary with wrap
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Pulse alpha
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = Math.max(0.15, p.alpha + Math.sin(p.pulsePhase) * 0.25);

        // Interaction with mouse: gentle repulsion & connection
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        if (distMouseSq < mouse.radius * mouse.radius) {
          const distMouse = Math.sqrt(distMouseSq);
          const force = (mouse.radius - distMouse) / mouse.radius;
          p.x -= (dxMouse / distMouse) * force * 1.5;
          p.y -= (dyMouse / distMouse) * force * 1.5;

          // Mouse connecting filament
          const mouseAlpha = (1 - distMouse / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(238, 191, 113, ${mouseAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();

        // Shimmering outer glow ring for larger particles
        if (p.radius > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentAlpha * 0.18})`;
          ctx.fill();
        }

        // Connect nearby particles with glowing golden lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxLineDistanceSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxLineDistance) * 0.28;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(222, 178, 98, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Full-background dynamic flowing mesh gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(180,138,60,0.22),rgba(255,255,255,0))]" />

      {/* 2. Diagonal moving golden light sweep wave */}
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(115deg,transparent_0%,transparent_35%,rgba(238,191,113,0.12)_48%,rgba(255,222,170,0.2)_50%,rgba(238,191,113,0.12)_52%,transparent_65%,transparent_100%)] bg-[length:250%_100%] animate-hero-light-sweep" />

      {/* 3. Micro dot geometric coordinate grid across 100% of the background */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af3720_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-60" />

      {/* 4. Full-Screen Interactive Golden Constellation Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 5. Ambient glowing corner auras */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#b48a3c]/15 rounded-full filter blur-[100px] animate-hero-float-slow" />
      <div className="absolute bottom-0 right-1/4 w-[650px] h-[400px] bg-[#eebf71]/15 rounded-full filter blur-[110px] animate-hero-float-reverse" />
    </div>
  );
}
