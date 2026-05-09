import { useState, useEffect } from 'react'

export function Navbar() {
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

  const navLinks = ['Services', 'About Us', 'Projects', 'Team', 'Contacts']

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-hero-bg/70 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center px-8 lg:px-16 py-5">
        {/* Logo */}
        <div
          className="animate-fade-in opacity-0 group cursor-pointer"
          style={{ animationDelay: '0.1s' }}
        >
          <h2 className="text-foreground text-xl font-semibold tracking-tight hover:text-primary transition-all duration-300 group-hover:glow-pulse">
            SENTINEL
          </h2>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link, idx) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
              className="animate-fade-in opacity-0 relative text-sm text-muted-foreground transition-colors duration-300 uppercase tracking-widest font-light group/link"
              style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            >
              <span
                className={`transition-colors duration-300 ${
                  hoveredLink === link ? 'text-foreground' : ''
                }`}
              >
                {link}
              </span>
              {hoveredLink === link && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-fade-in" />
              )}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onMouseEnter={() => setIsCtaHovered(true)}
          onMouseLeave={() => setIsCtaHovered(false)}
          className="hidden md:inline-flex animate-fade-in opacity-0 px-6 py-3 lg:px-8 lg:py-4 rounded-lg uppercase text-xs tracking-widest font-semibold text-foreground bg-nav-button hover:bg-primary/30 transition-all duration-300 active:scale-[0.97] relative overflow-hidden group"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="relative z-10">Get Quote</span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {/* Glow on hover */}
          {isCtaHovered && (
            <div className="absolute inset-0 bg-primary/20 blur-lg animate-pulse" />
          )}
        </button>
      </div>
    </nav>
  )
}
