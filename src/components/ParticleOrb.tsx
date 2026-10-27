import React, { useEffect, useRef } from 'react';

interface ParticleOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onTap: () => void;
  themeColor?: 'lavender' | 'sunset' | 'cosmic';
}

export const ParticleOrb: React.FC<ParticleOrbProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onTap,
  themeColor = 'lavender',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = 300);
    const height = (canvas.height = 300);
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = 88;

    const particleCount = 650;
    const particles: {
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      phase: number;
    }[] = [];

    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        baseX: x * baseRadius,
        baseY: y * baseRadius,
        baseZ: z * baseRadius,
        size: Math.random() * 1.5 + 1.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let angleX = 0;
    let angleY = 0;
    let pulseScale = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const rotSpeed = isListening ? 0.03 : isSpeaking ? 0.025 : isProcessing ? 0.04 : 0.008;
      angleY += rotSpeed;
      angleX += rotSpeed * 0.4;

      const time = Date.now() * 0.003;
      pulseScale = isListening
        ? 1.08 + Math.sin(time * 3) * 0.08
        : isSpeaking
        ? 1.05 + Math.sin(time * 4) * 0.05
        : 1.0 + Math.sin(time) * 0.02;

      // Soft ambient background aura
      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        baseRadius * pulseScale * 1.45
      );
      if (themeColor === 'sunset') {
        auraGradient.addColorStop(0, 'rgba(255, 180, 210, 0.45)');
        auraGradient.addColorStop(0.5, 'rgba(235, 120, 180, 0.2)');
        auraGradient.addColorStop(1, 'rgba(122, 88, 230, 0)');
      } else if (themeColor === 'cosmic') {
        auraGradient.addColorStop(0, 'rgba(142, 225, 252, 0.5)');
        auraGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
        auraGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      } else {
        auraGradient.addColorStop(0, 'rgba(224, 195, 252, 0.55)');
        auraGradient.addColorStop(0.5, 'rgba(180, 150, 248, 0.3)');
        auraGradient.addColorStop(1, 'rgba(122, 88, 230, 0)');
      }

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * pulseScale * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Outer delicate orbital ring
      ctx.save();
      ctx.strokeStyle = isListening
        ? 'rgba(239, 68, 68, 0.5)'
        : 'rgba(122, 88, 230, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        baseRadius * pulseScale * 1.35,
        baseRadius * pulseScale * 0.45,
        angleY * 0.5,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const transformed = particles.map((p) => {
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        const wave = Math.sin(time * 2 + p.phase) * (isListening ? 6 : 2);
        const currentScale = pulseScale + wave * 0.01;

        return {
          x: centerX + x1 * currentScale,
          y: centerY + y2 * currentScale,
          z: z2,
          size: p.size,
        };
      });

      transformed.sort((a, b) => a.z - b.z);

      for (const p of transformed) {
        const depthNorm = (p.z + baseRadius) / (baseRadius * 2);
        const alpha = Math.max(0.12, Math.min(0.95, depthNorm * 0.85 + 0.15));
        const renderedSize = Math.max(0.8, p.size * (0.6 + depthNorm * 0.7));

        ctx.beginPath();
        ctx.arc(p.x, p.y, renderedSize, 0, Math.PI * 2);

        if (isListening) {
          ctx.fillStyle = `rgba(244, 63, 94, ${alpha})`;
        } else if (isSpeaking) {
          ctx.fillStyle = `rgba(79, 70, 229, ${alpha})`;
        } else {
          if (depthNorm > 0.6) {
            ctx.fillStyle = `rgba(109, 68, 232, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(168, 136, 255, ${alpha})`;
          }
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, isProcessing, themeColor]);

  return (
    <div
      onClick={onTap}
      className="relative flex items-center justify-center cursor-pointer select-none group my-2"
      title="Tap to speak with NURA Ai"
    >
      {(isListening || isSpeaking) && (
        <div
          className={`absolute rounded-full pointer-events-none animate-ripple ${
            isListening ? 'border-2 border-red-400' : 'border-2 border-purple-400'
          }`}
          style={{ width: '270px', height: '270px' }}
        />
      )}

      <div
        className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
          isListening
            ? 'w-64 h-64 bg-red-300/30 blur-2xl'
            : isSpeaking
            ? 'w-64 h-64 bg-purple-400/30 blur-2xl'
            : 'w-60 h-60 bg-[#E0C3FC]/40 blur-2xl group-hover:bg-[#D5B6FC]/50'
        }`}
      />

      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-[260px] h-[260px] relative z-10 transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};
