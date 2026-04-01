import { useState } from 'react'
import OhakaApp from './OhakaApp.jsx'
import PricingPage from './PricingPage.jsx'
import LandingPage from './LandingPage.jsx'

export default function App() {
  const [page, setPage] = useState('landing') // 'landing' | 'app' | 'pricing'
  return (
    <>
      {page === 'landing' && <LandingPage onEnterApp={() => setPage('app')} />}
      {page === 'app' && <OhakaApp onOpenPricing={() => setPage('pricing')} />}
      {page === 'pricing' && <PricingPage onBack={() => setPage('app')} />}
    </>
  )
}
