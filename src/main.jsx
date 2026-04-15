import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'
import MenuPage from './pages/MenuPage'
import KitchenPage from './pages/KitchenPage'
import CashierPage from './pages/CashierPage'
import OwnerPage from './pages/OwnerPage'
import SetupPage from './pages/SetupPage'

function Home() {
  return (
    <div className="shell">
      <div className="card hero">
        <span className="badge">TableTech Lite</span>
        <h1>QR sipariş sistemi, sade ve deploy etmeye hazır.</h1>
        <p>
          Bu sürüm VPS istemez. Vercel + Supabase ile çalışır. Müşteri menüsü,
          mutfak, kasa ve owner paneli tek projede.
        </p>
        <div className="grid two">
          <Link className="button" to="/setup/demo-restoran">Kurulum rehberi</Link>
          <a className="button secondary" href="https://supabase.com" target="_blank" rel="noreferrer">Supabase aç</a>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup/:restaurantSlug" element={<SetupPage />} />
        <Route path="/menu/:restaurantSlug/:tableNumber" element={<MenuPage />} />
        <Route path="/kitchen/:restaurantSlug" element={<KitchenPage />} />
        <Route path="/cashier/:restaurantSlug" element={<CashierPage />} />
        <Route path="/owner/:restaurantSlug" element={<OwnerPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
