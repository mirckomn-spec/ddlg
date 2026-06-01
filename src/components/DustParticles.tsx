"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
};

const PARTICLE_COUNT = 36;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: randomBetween(-0.2, 0.2),
    vy: randomBetween(-0.7, -0.2),
    radius: randomBetween(2, 5),
    opacity: randomBetween(0.5, 0.9),
  };
}

export default function DustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    } as CanvasRenderingContext2DSettings);
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;
    let lastTime = 0;
    let running = true;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(width, height),
      );
    };

    const respawn = (p: Particle) => {
      p.x = Math.random() * width;
      p.y = height + randomBetween(8, 32);
      p.vx = randomBetween(-0.2, 0.2);
      p.vy = randomBetween(-0.7, -0.2);
      p.radius = randomBetween(2, 5);
      p.opacity = randomBetween(0.5, 0.9);
    };

    const drawParticle = (p: Particle) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (time: number) => {
      if (!running) return;

      const delta = lastTime ? Math.min((time - lastTime) / 16.667, 2) : 1;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;

        if (p.y < -24 || p.x < -24 || p.x > width + 24) {
          respawn(p);
        }

        drawParticle(p);
      }

      frameId = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        lastTime = 0;
        frameId = requestAnimationFrame(tick);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frameId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="dust-canvas" aria-hidden="true" />;
}
