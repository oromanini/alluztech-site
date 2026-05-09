import { useState, useEffect } from 'react'

export function AlluzNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [isCtaHovered, setIsCtaHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = ['Método', 'Cases', 'Tecnologias', 'Sobre', 'FAQ']

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.5s ease',
        background: isScrolled ? 'rgba(12, 11, 9, 0.7)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(14px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,171,46,0.12)' : '1px solid transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 32px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            opacity: 0,
            animation: 'fade-in 0.5s ease-out forwards',
            animationDelay: '0.1s',
          }}
        >
          <h2
            style={{
              color: '#F5EED8',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0',
              fontFamily: 'Sora, sans-serif',
              cursor: 'pointer',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFAB2E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#F5EED8')}
          >
            ALLUZ
          </h2>
        </div>

        {/* Nav Links */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link, idx) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                fontSize: '14px',
                color: hoveredLink === link ? '#FFAB2E' : 'rgba(192,180,144,1)',
                fontWeight: 500,
                transition: 'color 0.3s',
                position: 'relative',
                opacity: 0,
                animation: 'fade-in 0.5s ease-out forwards',
                animationDelay: `${0.1 + idx * 0.05}s`,
                fontFamily: 'Sora, sans-serif',
              }}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link}
              {hoveredLink === link && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #FFAB2E, transparent)',
                    animation: 'fade-in 0.3s ease-out',
                  }}
                />
              )}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onMouseEnter={() => setIsCtaHovered(true)}
          onMouseLeave={() => setIsCtaHovered(false)}
          style={{
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.005em',
            background: isCtaHovered
              ? 'linear-gradient(135deg, #FFAB2E 0%, #D4891A 100%)'
              : 'linear-gradient(135deg, #FFAB2E 0%, #D4891A 100%)',
            color: '#1A0F00',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0,
            animation: 'fade-in 0.5s ease-out forwards',
            animationDelay: '0.4s',
            boxShadow: isCtaHovered
              ? '0 14px 32px rgba(255,171,46,0.35)'
              : '0 8px 22px rgba(255,171,46,0.25)',
            filter: isCtaHovered ? 'brightness(1.05)' : 'brightness(1)',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Diagnóstico grátis
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @media (max-width: 880px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}
