import '@/components/ShopGrid/styles.css'

type PrintFormat = 'portrait' | 'landscape' | 'cinema'

interface MockProduct {
  id: string
  title: string
  location: string
  price: number
  format: PrintFormat
}

interface PrintSection {
  format: PrintFormat
  label: string
  dims: string
  products: MockProduct[]
}

const SECTIONS: PrintSection[] = [
  {
    format: 'portrait',
    label: 'Native Print — Portrait',
    dims: '18 × 24 in',
    products: [
      { id: '1', title: 'Birds Nest', location: 'Dandenong Ranges, VIC', price: 95, format: 'portrait' },
      { id: '2', title: 'Platform 12', location: 'Flinders Street, VIC', price: 95, format: 'portrait' },
      { id: '3', title: 'Quiet Hours', location: 'St Kilda, VIC', price: 95, format: 'portrait' },
      { id: '4', title: 'Southbound', location: 'Great Ocean Road, VIC', price: 95, format: 'portrait' },
    ],
  },
  {
    format: 'landscape',
    label: 'Native Print — Landscape',
    dims: '24 × 18 in',
    products: [
      { id: '5', title: 'Down Under', location: 'Great Barrier Reef, QLD', price: 95, format: 'landscape' },
    ],
  },
  {
    format: 'cinema',
    label: 'Cinema Poster',
    dims: '36 × 24 in',
    products: [
      { id: '6', title: 'Refractions', location: 'Melbourne CBD, VIC', price: 135, format: 'cinema' },
    ],
  },
]

function PrintCard({ product }: { product: MockProduct }) {
  return (
    <article className="print-card">
      <div className={`print-card__image print-card__image--${product.format}`} />
      <div className="print-card__info">
        <p className="print-card__title">{product.title}</p>
        <p className="print-card__location">{product.location}</p>
        <p className="print-card__price">${product.price} AUD</p>
      </div>
    </article>
  )
}

export function ShopGrid() {
  return (
    <div className="shop-grid-wrap">
      <header className="shop-hero">
        <span className="shop-hero__label">Prints</span>
        <h1 className="shop-hero__title">Take a piece home.</h1>
        <p className="shop-hero__subtitle">Edition prints on fine-art paper — every piece made to order.</p>
      </header>

      <div className="shop-sections">
        {SECTIONS.map((section) => (
          <section key={section.format} className="shop-section">
            <div className="shop-section__header">
              <span className="shop-section__format">{section.label}</span>
              <span className="shop-section__dims">{section.dims}</span>
            </div>
            <div className="shop-grid">
              {section.products.map((product) => (
                <PrintCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
