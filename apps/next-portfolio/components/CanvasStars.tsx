"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  blinkSpeed: number;
  brightness: number;
  pulseOffet: number;
}

interface ShootingStar {
  startX: number;
  startY: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  active: boolean;
  delay: number;
}

export function CanvasStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize handler
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvas) {
          canvas.width = entry.contentRect.width;
          canvas.height = entry.contentRect.height;
        }
      }
    });
    resizeObserver.observe(canvas);

    // Initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate static stars
    const numStars = window.innerWidth < 768 ? 50 : 150;
    const stars: Star[] = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.5,
      blinkSpeed: Math.random() * 0.05 + 0.01,
      brightness: Math.random(),
      pulseOffet: Math.random() * Math.PI * 2,
    }));

    // Shooting stars
    const shootingStars: ShootingStar[] = Array.from({ length: 2 }).map(() => ({
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      length: Math.random() * 80 + 20,
      speed: Math.random() * 10 + 5,
      opacity: 0,
      active: false,
      delay: Math.random() * 200,
    }));

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      // Draw Twinkling Stars
      stars.forEach((star) => {
        const pulse = Math.sin(time * star.blinkSpeed + star.pulseOffet) * 0.5 + 0.5;
        const alpha = star.brightness * pulse;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        
        // Add a slight glow effect for bigger stars
        if (star.size > 1.2 && alpha > 0.5) {
            ctx.shadowBlur = star.size * 3;
            ctx.shadowColor = "white";
        } else {
            ctx.shadowBlur = 0;
        }
      });

      // Reset shadow for shooting stars
      ctx.shadowBlur = 0;

      // Draw Shooting Stars
      shootingStars.forEach((star) => {
        if (!star.active) {
          star.delay--;
          if (star.delay <= 0) {
            star.active = true;
            star.startX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
            star.startY = Math.random() * canvas.height * 0.5;
            star.x = star.startX;
            star.y = star.startY;
            star.opacity = 1;
            star.speed = Math.random() * 10 + 5;
            star.delay = Math.random() * 300 + 100;
          }
        } else {
          star.x -= star.speed;
          star.y += star.speed;
          
          star.opacity -= 0.01;

          if (star.opacity <= 0 || star.x < 0 || star.y > canvas.height) {
            star.active = false;
          } else {
            const grad = ctx.createLinearGradient(star.x, star.y, star.x + star.length, star.y - star.length);
            grad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x + star.length, star.y - star.length);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
