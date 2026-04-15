import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { createOrder, getCategoriesWithItems, getRestaurantBySlug } from '../lib/api'

export default function MenuPage() {
  const { restaurantSlug, tableNumber } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [note, setNote] = useState('')
  const [cart, setCart] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function run() {
      try {
        setLoading(true)
        const restaurantData = await getRestaurantBySlug(restaurantSlug)
        const categoryData = await getCategoriesWithItems(restaurantData.id)
        setRestaurant(restaurantData)
        setCategories(categoryData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [restaurantSlug])

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((x) => x.id === item.id)
      if (found) {
        return prev.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function changeQty(id, diff) {
    setCart((prev) => prev
      .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + diff) } : item)
      .filter((item) => item.quantity > 0))
  }

  async function submitOrder() {
    try {
      setError('')
      setSuccess('')
      if (!restaurant) return
      if (cart.length === 0) {
        setError('Sepet boş.')
        return
      }
      setSubmitting(true)
      await createOrder({
        restaurantId: restaurant.id,
        tableNumber: Number(tableNumber),
        customerName,
        note,
        cart,
      })
      setSuccess('Siparişiniz alındı. Ödemenizi kasada yapabilirsiniz.')
      setCart([])
      setCustomerName('')
      setNote('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout
      title={restaurant ? `${restaurant.name} · Masa ${tableNumber}` : 'Menü yükleniyor'}
      subtitle="QR menü, hızlı sipariş ve kasada ödeme"
    >
      {loading ? <div className="card">Yükleniyor...</div> : null}
      {error ? <div className="card error">{error}</div> : null}
      {success ? <div className="card success">{success}</div> : null}

      {!loading && restaurant ? (
        <div className="grid two-strong">
          <div>
            {categories.map((category) => (
              <div className="card" key={category.id}>
                <h2>{category.name}</h2>
                <div className="stack">
                  {category.items.map((item) => (
                    <div key={item.id} className="menu-item">
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.description || 'Açıklama eklenmemiş.'}</p>
                      </div>
                      <div className="menu-actions">
                        <span>₺{Number(item.price).toFixed(2)}</span>
                        <button onClick={() => addToCart(item)}>Ekle</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="card sticky">
            <h2>Sipariş Özeti</h2>
            <label>İsim (opsiyonel)</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Örn. Mustafa" />
            <label>Not (opsiyonel)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Az acılı, soğansız..." />

            <div className="stack compact">
              {cart.length === 0 && <p>Henüz ürün eklemediniz.</p>}
              {cart.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>₺{Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="qty-box">
                    <button onClick={() => changeQty(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-line">
              <strong>Toplam</strong>
              <strong>₺{total.toFixed(2)}</strong>
            </div>
            <small>Ödeme kasada alınır. Online ödeme bu sürümde kapalıdır.</small>
            <button className="button wide" onClick={submitOrder} disabled={submitting}>
              {submitting ? 'Gönderiliyor...' : 'Siparişi Ver'}
            </button>
          </div>
        </div>
      ) : null}
    </Layout>
  )
}
