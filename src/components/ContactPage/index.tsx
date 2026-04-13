import Image from 'next/image'
import type { Contact, Media } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ItemsList } from '@/components/ItemsList'
import { ContactForm } from '@/components/ContactForm'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import './styles.css'

export async function ContactPage() {
  const contact = (await getCachedGlobal('contact', 1)()) as Contact
  const backgroundImage =
    contact.backgroundImage && typeof contact.backgroundImage === 'object'
      ? (contact.backgroundImage as Media)
      : null

  const payload = await getPayload({ config: configPromise })
  const { docs: serviceItems } = await payload.find({
    collection: 'service-items',
    sort: 'order',
  })

  return (
    <div className="contact-page">
      {backgroundImage?.url && (
        <div className="contact-page__ambient" aria-hidden="true">
          <Image src={backgroundImage.url} alt="" fill className="contact-page__ambient-image" />
        </div>
      )}

      <header className="contact-header">
        {contact.eyebrow && <p className="contact-header__eyebrow">{contact.eyebrow}</p>}
        <h1 className="contact-header__headline">{contact.headline}</h1>
        {contact.subline && <p className="contact-header__sub">{contact.subline}</p>}
      </header>

      <div className="contact-body">
        <ItemsList locationNote={contact.locationNote} items={serviceItems} />

        <section className="contact-form-section">
          <ContactForm enquiryTypes={serviceItems} />
        </section>
      </div>
    </div>
  )
}
