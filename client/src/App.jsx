import { useEffect, useState } from 'react'

const API = 'http://localhost:3001'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [tab, setTab] = useState('shop')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
    fetch(`${API}/orders`).then(r => r.json()).then(setOrders)
  }, [])

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id)
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter(i => i.id !== id))
  }

  function changeQty(id, qty) {
    if (qty < 1) return removeFromCart(id)
    setCart(cart.map(i => i.id === id ? { ...i, qty } : i))
  }

  async function checkout() {
    if (cart.length === 0) return
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const order = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(i => ({ title: i.title, price: i.price, qty: i.qty, image: i.image })),
        total
      })
    }).then(r => r.json())
    setOrders([order, ...orders])
    setCart([])
    setOrdered(true)
    setTimeout(() => setOrdered(false), 3000)
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Nav */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f] z-10">
        <h1 className="text-lg font-bold">Shop</h1>
        <div className="flex gap-1 bg-white/5 border border-white/8 p-1 rounded-xl">
          <button
            onClick={() => setTab('shop')}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === 'shop' ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Products
          </button>
          <button
            onClick={() => setTab('cart')}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === 'cart' ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === 'orders' ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {tab === 'shop' && (
          <>
            {loading ? (
              <p className="text-gray-600 text-sm text-center py-16">Loading products...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white/3 border border-white/8 rounded-2xl p-4 flex flex-col">
                    <img src={p.image} alt={p.title} className="h-32 object-contain mb-3 mx-auto" />
                    <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                    <p className="text-sm text-gray-200 font-medium leading-snug flex-1 line-clamp-2">{p.title}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-white font-bold">${p.price}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'cart' && (
          <div className="max-w-lg mx-auto">
            {ordered && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm mb-6">
                Order placed successfully!
              </div>
            )}
            {cart.length === 0 ? (
              <p className="text-center text-gray-700 py-16 text-sm">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl p-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => changeQty(item.id, item.qty - 1)} className="w-6 h-6 bg-white/10 rounded-md text-sm hover:bg-white/20 transition-colors">−</button>
                        <span className="text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => changeQty(item.id, item.qty + 1)} className="w-6 h-6 bg-white/10 rounded-md text-sm hover:bg-white/20 transition-colors">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-400 text-sm ml-1 transition-colors">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-white/3 border border-white/8 rounded-xl px-5 py-4">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-white font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={checkout}
                  className="w-full mt-3 bg-white text-black py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="max-w-lg mx-auto space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-8 h-8 object-contain shrink-0" />
                      <p className="text-sm text-gray-400 flex-1 truncate">{item.title}</p>
                      <p className="text-xs text-gray-600">x{item.qty}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-gray-700 py-16 text-sm">No orders yet.</p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
