import type { ServiceItem } from '@/payload-types'
import './styles.css'

type Props = {
  locationNote?: string | null
  items: Pick<ServiceItem, 'id' | 'title' | 'text'>[]
}

export function ItemsList({ locationNote, items }: Props) {
  return (
    <aside className="items-list">
      {items.map(({ id, title, text }) => (
        <div key={id} className="items-list__item">
          <p className="items-list__item-title">{title}</p>
          <p className="items-list__item-text">{text}</p>
        </div>
      ))}

      {locationNote && <p className="items-list__note">{locationNote}</p>}
    </aside>
  )
}
