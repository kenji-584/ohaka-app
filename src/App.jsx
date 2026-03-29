import { useState } from 'react'
import OhakaApp from './OhakaApp.jsx'
import PricingPage from './PricingPage.jsx'

export default function App() {
  const [page, setPage] = useState('app') // 'app' | 'pricing'
  return (
    <>
      {page === 'app' && <OhakaApp onOpenPricing={() => setPage('pricing')} />}
      {page === 'pricing' && <PricingPage onBack={() => setPage('app')} />}
    </>
  )
}
