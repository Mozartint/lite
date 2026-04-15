import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { getOrders, getRestaurantBySlug } from '../lib/api'

export default function OwnerPage() {
  const { restaurantSlug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  async function loadAll() {
    try {
      const restaurantData = await getRestaurantBySlug(restaurantSlug)
      const orderData = await getOrders(restaurantData.id)
      setRestaurant(restaurantData)
      setOrders(orderData)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAll()
    const timer = setInterval(loadAll, 5000)
    return () => clearInterval(timer)
  }, [restaurantSlug])

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const todayOrders = orders.filter((o) => o.created_at?.slice(0, 10) === today)
    return {
      orderCount: todayOrders.length,
      revenue: todayOrders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_amount), 0),
      pending: orders.filter((o) => ['pending', 'preparing'].includes(o.status)).length,
      ready: orders.filter((o) => o.status === 'ready').length,
    }
  }, [orders])

  return (
    <Layout title={`${restaurant?.name || ''} · Owner Paneli`} subtitle="Günlük durum özeti">
      {error ? <div className="card error">{error}</div> : null}
      <div className="grid four">
        <div className="card metric"><small>Bugünkü Sipariş</small><strong>{metrics.orderCount}</strong></div>
        <div className="card metric"><small>Bugünkü Ciro</small><strong>₺{metrics.revenue.toFixed(2)}</strong></div>
        <div className="card metric"><small>Aktif Hazırlık</small><strong>{metrics.pending}</strong></div>
        <div className="card metric"><small>Kasayı Bekleyen</small><strong>{metrics.ready}</strong></div>
      </div>
      <div className="card">
        <h2>Canlı Siparişler</h2>
        <div className="stack compact">
          {orders.slice(0, 10).map((order) => (
            <div className="list-row" key={order.id}>
              <span>Masa {order.table_number} · {order.status}</span>
              <strong>₺{Number(order.total_amount).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
