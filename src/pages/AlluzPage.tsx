import { AlluzNavbar } from '../components/AlluzNavbar'
import { AlluzHero } from '../components/AlluzHero'

export function AlluzPage() {
  return (
    <div style={{ background: '#0C0B09', minHeight: '100vh' }}>
      <AlluzNavbar />
      <AlluzHero />

      {/* Placeholder sections for scroll test */}
      <section style={{ padding: '120px 32px', background: '#161310', borderTop: '1px solid rgba(255,171,46,0.12)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', color: '#FFAB2E', marginBottom: '32px', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>
            Método Alluz
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(192,180,144,1)', lineHeight: '1.6', maxWidth: '600px', fontFamily: 'Sora, sans-serif' }}>
            Três paradas. Você entende cada passo, cada tecnologia, cada custo antes de começar. Nada é caixa preta.
          </p>
        </div>
      </section>

      <section style={{ padding: '120px 32px', background: '#1A1410', borderTop: '1px solid rgba(255,171,46,0.12)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', color: '#FFAB2E', marginBottom: '32px', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>
            Cases de Sucesso
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(192,180,144,1)', lineHeight: '1.6', maxWidth: '600px', fontFamily: 'Sora, sans-serif' }}>
            Três PMEs, três dores diferentes, mesmo método. Resultados reais e mensuráveis.
          </p>
        </div>
      </section>
    </div>
  )
}
