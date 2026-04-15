import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusPill from '../components/StatusPill'
import { getOrders, getRestaurantBySlug, updatePaymentStatus } from '../lib/api'

export default function CashierPage() {
  const { restaurantSlug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  async function loadAll() {
    try {
      const restaurantData = await getRestaurantBySlug(restaurantSlug)
      const orderData = await getOrders(restaurantData.id)
      setRestaurant(restaurantData)
      setOrders(orderData.filter((o) => ['ready', 'paid'].includes(o.status)))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAll()
    const timer = setInterval(loadAll, 3000)
    return () => clearInterval(timer)
  }, [restaurantSlug])

  async function markPaid(orderId) {
    await updatePaymentStatus(orderId, 'paid')
    await loadAll()
  }

  return (
    <Layout title={`${restaurant?.name || ''} · Kasa Paneli`} subtitle="Hazır siparişleri kapat">
      {error ? <div className="card error">{error}</div> : null}
      <div className="grid two">
        {orders.map((order) => (
          <div className="card" key={order.id}>
            <div className="row between">
              <h2>Masa {order.table_number}</h2>
              <StatusPill status={order.status} />
            </div>
            <p>Toplam: <strong>₺{Number(order.total_amount).toFixed(2)}</strong></p>
            <p>Ödeme: <strong>{order.payment_status === 'paid' ? 'Ödendi' : 'Kasada Ödenecek'}</strong></p>
            <div className="stack compact">
              {order.order_items?.map((item) => (
                <div key={item.id} className="list-row">
                  <span>{item.quantity}x {item.name_snapshot}</span>
                  <strong>₺{Number(item.line_total).toFixed(2)}</strong>
                </div>
              ))}
            </div>
            {order.payment_status !== 'paid' ? (
              <button className="button wide" onClick={() => markPaid(order.id)}>Ödendi Olarak İşaretle</button>
            ) : null}
          </div>
        ))}
      </div>
    </Layout>
  )
}
