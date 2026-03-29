import { getPayload } from 'payload'
import configPromise from '@payload-config'
import './styles.css'

type Props = {
  locationNote: string
}

export async function ServiceItemsList({ locationNote }: Props) {
  const payload = await getPayload({ config: configPromise })
  const { docs: serviceItems } = await payload.find({
    collection: 'service-items',
    sort: 'order',
  })

  return (
    <aside className="service-items">
      {serviceItems.map(({ title, text }) => (
        <div key={title} className="service-items__item">
          <p className="service-items__item-title">{title}</p>
          <p className="service-items__item-text">{text}</p>
        </div>
      ))}

      {locationNote && <p className="service-items__note">{locationNote}</p>}
    </aside>
  )
}
