import './App.css'
import { useState } from 'react'

const products = [
  {
    id: 'camisa-brasil-01',
    name: 'Camisa Brasil Azul e Preta',
    price: 'R$ 189,90',
    description:
      'Modelo leve, confortável e com visual moderno para compor o catálogo da loja.',
    image: '/camisa-brasil-azul-preta.webp',
  },
  {
    id: 'camisa-brasil-02',
    name: 'Camisa Brasil Amarela',
    price: 'R$ 189,90',
    description:
      'Modelo leve, confortável e com visual moderno para compor o catálogo da loja.',
    image: '/camisa-brazil-amarela.webp',
  },
]

const MOCK_DELIVERY_DATE = 'Entrega em até 7 dias úteis'
const ORDERS_STORAGE_KEY = 'des-mobile-orders'

function onlyDigits(value) {
  return value.replace(/\D/g, '')
}

function parseBrlPrice(value) {
  const normalized = value.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.')
  return Number(normalized)
}

function formatBrlPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function loadOrders() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    const parsedOrders = rawOrders ? JSON.parse(rawOrders) : []

    return Array.isArray(parsedOrders) ? parsedOrders : []
  } catch {
    return []
  }
}

function saveOrders(orders) {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

function isValidCpf(value) {
  const cpf = onlyDigits(value)

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false
  }

  const calculateDigit = (base, factor) => {
    const total = base
      .split('')
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0)
    const remainder = (total * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10)
  const secondDigit = calculateDigit(cpf.slice(0, 10), 11)

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
}

function isValidCardNumber(value) {
  const cardNumber = onlyDigits(value)
  return cardNumber.length >= 13 && cardNumber.length <= 19
}

function isValidCcv(value) {
  const ccv = onlyDigits(value)
  return ccv.length === 3 || ccv.length === 4
}

function isValidName(value) {
  return /^[A-Za-zÀ-ÿ'\- ]{2,}$/.test(value.trim())
}

function ProductCard({ product, onViewDetails }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/favicon.svg'
          }}
        />
      </div>
      <small className="image-path">{product.image}</small>

      <h2>{product.name}</h2>
      <p className="product-description">{product.description}</p>

      <div className="product-footer">
        <strong className="product-price">{product.price}</strong>
        <button
          type="button"
          className="product-button"
          onClick={() => onViewDetails(product)}
        >
          Ver detalhes
        </button>
      </div>
    </article>
  )
}

function ProductDetails({ product, onBack, onCheckout }) {
  if (!product) return null

  return (
    <main className="details-page">
      <header className="page-header">
        <button className="back-button" onClick={onBack} aria-label="Voltar">
          ← Voltar
        </button>
        <h1>{product.name}</h1>
        <p className="section-note">{product.category} — {product.price}</p>
      </header>

      <section className="details-content">
        <div className="details-image-wrap">
          <img
            className="details-image"
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/favicon.svg'
            }}
          />
        </div>

        <div className="details-copy">
          <p className="product-description">{product.description}</p>
          <div className="details-info-grid">
            <div className="details-info-card">
              <span>Data de entrega</span>
              <strong>{MOCK_DELIVERY_DATE}</strong>
            </div>

            <div className="details-info-card">
              <span>Status do pedido</span>
              <strong>Em separação</strong>
            </div>

            <div className="details-info-card">
              <span>Preço</span>
              <strong>{product.price}</strong>
            </div>
          </div>
          <div className="details-actions">
            <button type="button" className="product-button" onClick={() => onCheckout(product)}>
              Ir para o checkout
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

function CheckoutOrderCard({ product, finalPrice }) {
  return (
    <section className="checkout-order-card" aria-label="Resumo do pedido">
      <div className="checkout-order-image-wrap">
        <img
          className="checkout-order-image"
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/favicon.svg'
          }}
        />
      </div>

      <div className="checkout-order-copy">
        <p className="checkout-order-label">Resumo do pedido</p>
        <h2>{product.name}</h2>
        <p className="checkout-order-meta">Entrega em até {MOCK_DELIVERY_DATE}</p>

        <div className="checkout-order-prices">
          <p className="checkout-price-line">
            <span>Preço original</span>
            <strong>{product.price}</strong>
          </p>
          <p className="checkout-price-line checkout-price-discount">
            <span>Cupom aplicado</span>
            <strong>-10%</strong>
          </p>
          <p className="checkout-price-line checkout-price-final">
            <span>Total com desconto</span>
            <strong>{formatBrlPrice(finalPrice)}</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

function OrderCard({ order }) {
  return (
    <article className="order-card">
      <div className="order-card-image-wrap">
        <img
          className="order-card-image"
          src={order.image}
          alt={order.productName}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/favicon.svg'
          }}
        />
      </div>

      <div className="order-card-copy">
        <div className="order-card-header">
          <h2>{order.productName}</h2>
          <span className="order-card-status">{order.status}</span>
        </div>

        <p className="order-card-meta">Pedido feito em {formatDateTime(order.purchasedAt)}</p>
        <p className="order-card-meta">Entrega prevista: {order.deliveryDate}</p>

        <div className="order-card-prices">
          <span>Total pago</span>
          <strong>{formatBrlPrice(order.finalPrice)}</strong>
        </div>
      </div>
    </article>
  )
}

function OrdersPage({ orders, onBack }) {
  return (
    <main className="orders-page">
      <header className="page-header">
        <button className="back-button" onClick={onBack} type="button" aria-label="Voltar">
          ← Voltar
        </button>
        <h1>Meus pedidos</h1>
        <p className="section-note">Acompanhe aqui os pedidos já realizados.</p>
      </header>

      {orders.length === 0 ? (
        <section className="empty-orders-state">
          <h2>Nenhum pedido ainda</h2>
          <p>Quando você finalizar uma compra, ela vai aparecer aqui.</p>
        </section>
      ) : (
        <section className="orders-list" aria-label="Lista de pedidos">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </section>
      )}
    </main>
  )
}

function CheckoutPage({ product, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    cardNumber: '',
    ccv: '',
  })
  const [errors, setErrors] = useState({})

  if (!product) return null

  const originalPrice = parseBrlPrice(product.price)
  const discountValue = originalPrice * 0.1
  const finalPrice = originalPrice - discountValue

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const updateCardNumber = (value) => {
    updateField('cardNumber', onlyDigits(value).slice(0, 19))
  }
  const updateCpf = (value) => {
    updateField('cpf', onlyDigits(value).slice(0, 11))
  }

  const updateCcv = (value) => {
    updateField('ccv', onlyDigits(value).slice(0, 4))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!isValidName(formData.name)) {
      nextErrors.name = 'Informe um nome válido.'
    }

    if (!isValidCpf(formData.cpf)) {
      nextErrors.cpf = 'Informe um CPF válido.'
    }

    if (!isValidCardNumber(formData.cardNumber)) {
      nextErrors.cardNumber = 'Informe um número de cartão válido.'
    }

    if (!isValidCcv(formData.ccv)) {
      nextErrors.ccv = 'Informe um CCV válido.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    window.alert('Compra realizada com sucesso!')

    onSuccess({
      id: `order-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      image: product.image,
      status: 'Pedido confirmado',
      purchasedAt: new Date().toISOString(),
      deliveryDate: MOCK_DELIVERY_DATE,
      originalPrice: product.price,
      finalPrice,
    })
  }

  return (
    <main className="checkout-page">
      <header className="page-header">
        <button className="back-button" onClick={onBack} type="button" aria-label="Voltar">
          ← Voltar
        </button>
        <h1>Checkout</h1>
        <p className="section-note">{product.name} — {product.price}</p>
      </header>

      <section className="checkout-summary">
        <CheckoutOrderCard product={product} finalPrice={finalPrice} />

        <div>
          <h2>Dados do pagamento</h2>
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span>Nome</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Seu nome completo"
              />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>

            <label className="field">
              <span>CPF</span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.cpf}
                pattern="[0-9]*"
                maxLength={11}
                onChange={(event) => updateCpf(event.target.value)}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <small className="field-error">{errors.cpf}</small>}
            </label>

            <label className="field">
              <span>Número do cartão</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={16}
                value={formData.cardNumber}
                onChange={(event) => updateCardNumber(event.target.value)}
                placeholder="0000 0000 0000 0000"
              />
              {errors.cardNumber && <small className="field-error">{errors.cardNumber}</small>}
            </label>

            <label className="field">
              <span>CCV</span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.ccv}
                pattern="[0-9]*"
                maxLength={3}
                onChange={(event) => updateCcv(event.target.value)}
                placeholder="123"
              />
              {errors.ccv && <small className="field-error">{errors.ccv}</small>}
            </label>

            <div className="checkout-actions">
              <button type="submit" className="product-button">
                Confirmar compra
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [screen, setScreen] = useState('catalog')
  const [orders, setOrders] = useState(loadOrders)

  const handleViewDetails = (product) => {
    setSelectedProduct(product)
    setScreen('details')
  }

  const handleGoToCheckout = (product) => {
    setSelectedProduct(product)
    setScreen('checkout')
  }

  const handleBackToCatalog = () => {
    setScreen('catalog')
    setSelectedProduct(null)
  }

  const handleOpenOrders = () => {
    setScreen('orders')
    setSelectedProduct(null)
  }

  const handlePurchaseSuccess = (order) => {
    setOrders((currentOrders) => {
      const nextOrders = [order, ...currentOrders]
      saveOrders(nextOrders)
      return nextOrders
    })
    setSelectedProduct(null)
    setScreen('orders')
  }

  if (screen === 'details') {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={handleBackToCatalog}
        onCheckout={handleGoToCheckout}
      />
    )
  }

  if (screen === 'checkout') {
    return (
      <CheckoutPage
        product={selectedProduct}
        onBack={() => setScreen('details')}
        onSuccess={handlePurchaseSuccess}
      />
    )
  }

  if (screen === 'orders') {
    return <OrdersPage orders={orders} onBack={handleBackToCatalog} />
  }

  return (
    <main className="catalog-page">
      <header className="page-header page-header-actions">
        <div>
          <h1>Sports Hub</h1>
          <p className="section-note">Catálogo de produtos</p>
        </div>

        <div className="catalog-header-actions">
          <button type="button" className="secondary-button" onClick={handleOpenOrders}>
            Meus pedidos
          </button>
        </div>

        <img className="catalog-logo" src="/favicon.svg" alt="Logo da marca" />
      </header>

      <section className="products-grid" aria-label="Produtos disponíveis">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
        ))}
      </section>
    </main>
  )
}

export default App
