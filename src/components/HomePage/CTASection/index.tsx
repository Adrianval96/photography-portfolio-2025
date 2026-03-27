import type { Homepage } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import './styles.css'

type CTASectionData = NonNullable<Homepage['ctaSection']>

type Props = {
  data: CTASectionData
}

export function CTASection({ data }: Props) {
  const { headline, subline, link } = data

  return (
    <section className="cta-section">
      <div className="cta-section__content">
        {headline && <h2 className="cta-section__headline">{headline}</h2>}
        {subline && <p className="cta-section__subline">{subline}</p>}
        {link && <CMSLink {...link} className="cta-section__link" />}
      </div>
    </section>
  )
}
