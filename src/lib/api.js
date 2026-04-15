import { supabase } from './supabase'

export async function getRestaurantBySlug(slug) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getCategoriesWithItems(restaurantId) {
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })

  if (categoriesError) throw categoriesError

  const { data: items, error: itemsError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (itemsError) throw itemsError

  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category_id === category.id),
  }))
}

export async function createOrder({ restaurantId, tableNumber, customerName, note, cart }) {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      restaurant_id: restaurantId,
      table_number: tableNumber,
      customer_name: customerName || null,
      note: note || null,
      total_amount: totalAmount,
      status: 'pending',
      payment_status: 'pay_at_cashier',
    })
    .select()
    .single()

  if (orderError) throw orderError

  const payload = cart.map((item) => ({
    order_id: order.id,
    menu_item_id: item.id,
    name_snapshot: item.name,
    price_snapshot: item.price,
    quantity: item.quantity,
    line_total: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(payload)
  if (itemsError) throw itemsError

  return order
}

export async function getOrders(restaurantId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw error
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  const patch = {
    payment_status: paymentStatus,
    status: paymentStatus === 'paid' ? 'paid' : 'ready',
  }
  const { error } = await supabase.from('orders').update(patch).eq('id', orderId)
  if (error) throw error
}
