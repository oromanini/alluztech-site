import React, { Suspense, useEffect, useRef, useState } from 'react'

const Spline = React.lazy(() => import('@splinetool/react-spline').then(mod => ({
  default: mod.default
})))

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)

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
      className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden"
    >
      {/* Spline 3D Background - Lazy loaded */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-hero-bg" />
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 z-[1] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-20 md:pb-20 pt-32">
        {/* Heading with animated AI text */}
        <div className="mb-6 md:mb-8 overflow-hidden">
          <h1
            className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground uppercase opacity-0 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            SENTINEL{' '}
            <span
              className="text-primary relative inline-block animate-glow-pulse"
              style={{ animationDelay: '0.3s' }}
            >
              AI
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <p
          className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          We implement security correctly.
        </p>

        {/* Description */}
        <p
          className="text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-6 md:mb-10 opacity-0 animate-fade-up leading-relaxed max-w-xl"
          style={{ animationDelay: '0.55s' }}
        >
          Enterprise security systems built in days. AI-powered surveillance
          deployed with zero-trust architecture. Smart access control set up
          for your entire facility. All of it done right, not just fast.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap gap-3 md:gap-4 opacity-0 animate-fade-up pointer-events-auto mb-6 md:mb-8"
          style={{ animationDelay: '0.7s' }}
        >
          {/* Primary Button - Book a Call */}
          <button
            onMouseEnter={() => setHoveredButton('call')}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative px-6 md:px-8 py-3 md:py-4 text-sm font-bold bg-primary text-primary-foreground rounded-sm cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-125 hover:shadow-[0_0_30px_rgba(119,255,64,0.5)] active:scale-[0.97]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book a Call
              <span className={`inline-block transition-all duration-300 ${hoveredButton === 'call' ? 'translate-x-1' : ''}`}>
                →
              </span>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* Glow effect on hover */}
            {hoveredButton === 'call' && (
              <div className="absolute inset-0 bg-primary/30 blur-lg animate-pulse" />
            )}
          </button>

          {/* Secondary Button - Our Work */}
          <button
            onMouseEnter={() => setHoveredButton('work')}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative px-6 md:px-8 py-3 md:py-4 text-sm font-bold bg-white text-background rounded-sm cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-95 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-[0.97]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Our Work
              <span className={`inline-block transition-all duration-300 ${hoveredButton === 'work' ? 'translate-x-1' : ''}`}>
                ↗
              </span>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* Subtle glow on hover */}
            {hoveredButton === 'work' && (
              <div className="absolute inset-0 bg-white/10 blur-lg" />
            )}
          </button>
        </div>

        {/* Trust Line */}
        <p
          className="text-muted-foreground/60 text-xs font-light opacity-0 animate-fade-up"
          style={{ animationDelay: '0.85s' }}
        >
          Trusted security partner. Columbus, OH. 12 systems deployed.
        </p>

        {/* Floating scroll indicator */}
        <div
          className="hidden md:flex items-center justify-center gap-2 mt-12 opacity-0 animate-fade-up pointer-events-none"
          style={{ animationDelay: '1s' }}
        >
          <span className="text-xs text-muted-foreground/50">Scroll to explore</span>
          <div className="animate-float-up">
            <svg
              className="w-4 h-6 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 animate-fade-in z-10" style={{ animationDelay: '1.2s' }} />
    </section>
  )
}
