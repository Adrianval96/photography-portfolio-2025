import './styles.css'

type Props = {
  statement: string
}

export function PositioningStrip({ statement }: Props) {
  return (
    <section className="positioning-strip">
      <p className="positioning-strip__statement">{statement}</p>
    </section>
  )
}
