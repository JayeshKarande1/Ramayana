'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulseVal: number;
  color: string;
  isSpark: boolean;
}

export default function TempleParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect reduced-motion preferences
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for subtle interactive displacement
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(48, Math.floor(width / 28));
    const particles: Particle[] = [];

    const sparkPalette = [
      'rgba(245, 158, 11, ',   // warm amber
      'rgba(251, 191, 36, ',   // bright gold
      'rgba(249, 115, 22, ',   // sacred saffron orange
      'rgba(253, 230, 138, '   // brilliant champagne gold
    ];

    for (let i = 0; i < particleCount; i++) {
      const isSpark = Math.random() > 0.3;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSpark ? Math.random() * 2.2 + 0.8 : Math.random() * 3.8 + 1.8,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        baseOpacity: Math.random() * 0.5 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseVal: Math.random() * Math.PI * 2,
        color: sparkPalette[Math.floor(Math.random() * sparkPalette.length)],
        isSpark,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ascend gently
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.pulseVal) * 0.25;
        p.pulseVal += p.pulseSpeed;

        // Subtle repulsion from cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110 && dist > 0) {
          const force = (110 - dist) / 110;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Loop around edges smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Glow calculation
        const currentOpacity = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.pulseVal));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isSpark) {
          // Sharp glowing spark
          ctx.fillStyle = `${p.color}${currentOpacity})`;
          ctx.shadowBlur = p.size * 5;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
        } else {
          // Soft drifting incense smoke mote
          ctx.fillStyle = `rgba(217, 180, 130, ${currentOpacity * 0.35})`;
          ctx.shadowBlur = p.size * 2;
          ctx.shadowColor = 'rgba(217, 180, 130, 0.2)';
        }

        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full opacity-70"
    />
  );
}
