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

function onlyDigits(value) {
  return value.replace(/\D/g, '')
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
        <img className="product-image" src={product.image} alt={product.name} />
      </div>

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
          <img className="details-image" src={product.image} alt={product.name} />
        </div>

        <div className="details-copy">
          <p className="product-description">{product.description}</p>
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

function CheckoutPage({ product, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    cardNumber: '',
    ccv: '',
  })
  const [errors, setErrors] = useState({})

  if (!product) return null

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
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

    onSuccess()
    window.alert('Compra realizada com sucesso!')
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
        <div className="checkout-summary-image-wrap">
          <img className="checkout-summary-image" src={product.image} alt={product.name} />
        </div>

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
                onChange={(event) => updateField('cpf', event.target.value)}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <small className="field-error">{errors.cpf}</small>}
            </label>

            <label className="field">
              <span>Número do cartão</span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.cardNumber}
                onChange={(event) => updateField('cardNumber', event.target.value)}
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
                onChange={(event) => updateField('ccv', event.target.value)}
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
        onSuccess={handleBackToCatalog}
      />
    )
  }

  return (
    <main className="catalog-page">
      <header className="page-header">
        <h1>Dev shop</h1>
        <p className="section-note">Catálogo de produtos</p>
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
