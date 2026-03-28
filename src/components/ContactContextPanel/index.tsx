import { getPayload } from 'payload'
import configPromise from '@payload-config'
import './styles.css'

type Props = {
  locationNote: string
}

export async function ContactContextPanel({ locationNote }: Props) {
  const payload = await getPayload({ config: configPromise })
  const { docs: serviceItems } = await payload.find({
    collection: 'service-items',
    sort: 'order',
  })

  return (
    <aside className="contact-context">
      {serviceItems.map(({ title, text }) => (
        <div key={title} className="contact-context__item">
          <p className="contact-context__item-title">{title}</p>
          <p className="contact-context__item-text">{text}</p>
        </div>
      ))}

      {locationNote && <p className="contact-context__note">{locationNote}</p>}
    </aside>
  )
}
