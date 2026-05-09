import React, { Suspense, useEffect, useRef, useState } from 'react'

const Spline = React.lazy(() => import('@splinetool/react-spline').then(mod => ({
  default: mod.default
})))

export function AlluzHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 25,
        y: (e.clientY / window.innerHeight - 0.5) * 25,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-end bg-alluz-void overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0C0B09 0%, #1A1410 100%)',
      }}
    >
      {/* Spline 3D Background - Lazy loaded */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div style={{ background: '#0C0B09' }} />
          }
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <Spline
              scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </Suspense>
      </div>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-20 md:pb-20 pt-32">
        {/* Eyebrow */}
        <div
          className="opacity-0 animate-fade-up mb-6 md:mb-8"
          style={{
            animationDelay: '0.1s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1F1B14, #161310)',
              border: '1px solid rgba(255,171,46,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2 L4 14 H11 L9 22 L20 9 H13 Z"
                fill="#FFAB2E"
                stroke="#FFD080"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#FFAB2E',
              fontWeight: 500,
            }}
          >
            Alluz Tech · IA para PMEs
          </span>
        </div>

        {/* Heading with animated accent */}
        <div className="mb-6 md:mb-8 overflow-hidden">
          <h1
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: '0.2s',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 700,
              lineHeight: '1.05',
              letterSpacing: '-0.05em',
              color: '#F5EED8',
              textTransform: 'uppercase',
              fontFamily: 'Sora, sans-serif',
            }}
          >
            Automatize o que você{' '}
            <span
              style={{
                color: '#FFAB2E',
                position: 'relative',
                display: 'inline-block',
                textShadow: '0 0 20px rgba(255,171,46,0.3)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              sempre delegou
            </span>{' '}
            manualmente.
          </h1>
        </div>

        {/* Subheading */}
        <p
          className="opacity-0 animate-fade-up"
          style={{
            animationDelay: '0.4s',
            color: 'rgba(245,238,216,0.8)',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)',
            fontWeight: 300,
            marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Recupere horas de trabalho toda semana.
        </p>

        {/* Description */}
        <p
          className="opacity-0 animate-fade-up"
          style={{
            animationDelay: '0.55s',
            color: 'rgba(192,180,144,1)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.25rem)',
            fontWeight: 300,
            marginBottom: 'clamp(1.5rem, 2.5vw, 2.5rem)',
            lineHeight: '1.6',
            maxWidth: '600px',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Implementamos a IA que se integra ao seu negócio — sem complicações
          técnicas. Diagnóstico grátis, preço fixo, suporte garantido.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap gap-3 md:gap-4 opacity-0 animate-fade-up pointer-events-auto mb-6 md:mb-8"
          style={{ animationDelay: '0.7s' }}
        >
          {/* Primary Button - Agendar Diagnóstico */}
          <button
            onMouseEnter={() => setHoveredButton('diagnosis')}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative px-6 md:px-8 py-3 md:py-4 text-sm font-bold rounded-sm cursor-pointer overflow-hidden transition-all duration-300 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #FFAB2E 0%, #D4891A 100%)',
              color: '#1A0F00',
              boxShadow: hoveredButton === 'diagnosis'
                ? '0 0 30px rgba(255,171,46,0.5)'
                : '0 8px 22px rgba(255,171,46,0.25)',
              filter: hoveredButton === 'diagnosis' ? 'brightness(1.1)' : 'brightness(1)',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Agendar diagnóstico
              <span
                className="inline-block transition-transform"
                style={{
                  transform: hoveredButton === 'diagnosis' ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                →
              </span>
            </span>
            {/* Shimmer effect */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                transform: 'translateX(-100%)',
                animation: `shimmer 0.7s ease-in-out ${hoveredButton === 'diagnosis' ? 'forwards' : ''}`,
              }}
            />
          </button>

          {/* Secondary Button - Ver Cases */}
          <button
            onMouseEnter={() => setHoveredButton('cases')}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative px-6 md:px-8 py-3 md:py-4 text-sm font-bold rounded-sm cursor-pointer overflow-hidden transition-all duration-300 active:scale-[0.97]"
            style={{
              background: 'transparent',
              color: '#FFAB2E',
              border: '1.5px solid rgba(255,171,46,0.4)',
              boxShadow: hoveredButton === 'cases'
                ? '0 0 25px rgba(255,171,46,0.3)'
                : 'none',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Ver cases
              <span
                className="inline-block transition-transform"
                style={{
                  transform: hoveredButton === 'cases' ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                ↗
              </span>
            </span>
            {/* Shimmer effect */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(255,171,46,0.1), transparent)',
                transform: 'translateX(-100%)',
                animation: `shimmer 0.7s ease-in-out ${hoveredButton === 'cases' ? 'forwards' : ''}`,
              }}
            />
          </button>
        </div>

        {/* Trust line */}
        <p
          className="opacity-0 animate-fade-up"
          style={{
            animationDelay: '0.85s',
            color: 'rgba(192,180,144,0.6)',
            fontSize: '0.75rem',
            fontWeight: 300,
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Já ajudamos +30 PMEs a economizar tempo e escalar operação.
        </p>

        {/* Floating scroll indicator */}
        <div
          className="hidden md:flex items-center justify-center gap-2 mt-12 opacity-0 animate-fade-up pointer-events-none"
          style={{ animationDelay: '1s' }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgba(192,180,144,0.5)',
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              animation: 'float-up 3s ease-in-out infinite',
            }}
          >
            <svg
              className="w-4 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'rgba(192,180,144,0.5)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Animated accent lines */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 animate-fade-in z-10"
        style={{
          animationDelay: '1.2s',
          background:
            'linear-gradient(to right, transparent, rgba(255,171,46,0.5), transparent)',
        }}
      />

      {/* Custom styles */}
      <style>{`
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255,171,46,0.3);
            opacity: 1;
          }
          50% {
            text-shadow: 0 0 40px rgba(255,171,46,0.6);
            opacity: 0.9;
          }
        }

        .animate-fade-up {
          animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
