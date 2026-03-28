import './styles.css'

const CONTEXT_ITEMS = [
  {
    title: 'Live performance',
    text: 'Concerts, theatre, club nights, fire arts — the unrepeatable moment.',
  },
  {
    title: 'Street',
    text: 'Self-directed work — unposed, environmental, driven by light and gesture.',
  },
  {
    title: 'Portrait sessions',
    text: 'Collaborative, unhurried, aimed at something real.',
  },
  {
    title: 'Prints & custom orders',
    text: 'Existing prints available in limited runs — custom sizes and finishes on request.',
  },
]

type Props = {
  locationNote: string
}

export function ContactContextPanel({ locationNote }: Props) {
  return (
    <aside className="contact-context">
      {CONTEXT_ITEMS.map(({ title, text }) => (
        <div key={title} className="contact-context__item">
          <p className="contact-context__item-title">{title}</p>
          <p className="contact-context__item-text">{text}</p>
        </div>
      ))}

      {locationNote && (
        <p className="contact-context__note">{locationNote}</p>
      )}
    </aside>
  )
}
