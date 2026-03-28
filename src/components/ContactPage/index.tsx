import type { Contact } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ContactContextPanel } from '@/components/ContactContextPanel'
import './styles.css'

export async function ContactPage() {
  const contact = (await getCachedGlobal('contact')()) as Contact

  return (
    <div className="contact-page">
      <div className="contact-page__ambient" aria-hidden="true" />

      <header className="contact-header">
        {contact.eyebrow && <p className="contact-header__eyebrow">{contact.eyebrow}</p>}
        <h1 className="contact-header__headline">{contact.headline}</h1>
        {contact.subline && <p className="contact-header__sub">{contact.subline}</p>}
      </header>

      <div className="contact-body">
        <ContactContextPanel locationNote={contact.locationNote ?? ''} />

        <section className="contact-form-section">{/* ContactForm — PR 2b */}</section>
      </div>
    </div>
  )
}
