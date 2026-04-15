import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusPill from '../components/StatusPill'
import { getOrders, getRestaurantBySlug, updateOrderStatus } from '../lib/api'

export default function KitchenPage() {
  const { restaurantSlug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  async function loadAll() {
    try {
      const restaurantData = await getRestaurantBySlug(restaurantSlug)
      const orderData = await getOrders(restaurantData.id)
      setRestaurant(restaurantData)
      setOrders(orderData.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAll()
    const timer = setInterval(loadAll, 3000)
    return () => clearInterval(timer)
  }, [restaurantSlug])

  async function nextStatus(order) {
    const map = { pending: 'preparing', preparing: 'ready' }
    const next = map[order.status]
    if (!next) return
    await updateOrderStatus(order.id, next)
    await loadAll()
  }

  return (
    <Layout title={`${restaurant?.name || ''} · Mutfak Paneli`} subtitle="Yeni siparişleri takip et">
      {error ? <div className="card error">{error}</div> : null}
      <div className="grid three">
        {orders.map((order) => (
          <div className="card" key={order.id}>
            <div className="row between">
              <h2>Masa {order.table_number}</h2>
              <StatusPill status={order.status} />
            </div>
            <p><strong>Müşteri:</strong> {order.customer_name || 'Belirtilmedi'}</p>
            {order.note ? <p><strong>Not:</strong> {order.note}</p> : null}
            <div className="stack compact">
              {order.order_items?.map((item) => (
                <div key={item.id} className="list-row">
                  <span>{item.quantity}x {item.name_snapshot}</span>
                  <strong>₺{Number(item.line_total).toFixed(2)}</strong>
                </div>
              ))}
            </div>
            {['pending', 'preparing'].includes(order.status) ? (
              <button className="button wide" onClick={() => nextStatus(order)}>
                {order.status === 'pending' ? 'Hazırlanıyor Yap' : 'Hazır Yap'}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </Layout>
  )
}
