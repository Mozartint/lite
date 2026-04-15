import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'

export default function SetupPage() {
  const { restaurantSlug } = useParams()

  return (
    <Layout title="Kurulum Rehberi" subtitle="VPS yok. Sadece Supabase ve Vercel.">
      <div className="card">
        <h2>1. Supabase SQL çalıştır</h2>
        <p><code>supabase_schema.sql</code> dosyasını Supabase SQL Editor içinde çalıştır.</p>
        <h2>2. .env oluştur</h2>
        <p><code>.env.example</code> dosyasını kopyala, proje URL ve anon key gir.</p>
        <h2>3. Demo veriyi ekle</h2>
        <p><code>seed.sql</code> dosyasını çalıştır. Varsayılan slug: <strong>{restaurantSlug}</strong></p>
        <h2>4. Vercel deploy</h2>
        <p>GitHub'a yükle, Vercel ile import et, env değişkenlerini ekle.</p>
        <h2>Linkler</h2>
        <div className="stack compact">
          <code>/menu/{restaurantSlug}/1</code>
          <code>/kitchen/{restaurantSlug}</code>
          <code>/cashier/{restaurantSlug}</code>
          <code>/owner/{restaurantSlug}</code>
        </div>
      </div>
    </Layout>
  )
}
