import type { PromoSectionBlock as Props } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import './styles.css'

export function PromoSectionBlock({ orientation = 'vertical', image, headline, body, enableLink, link }: Props) {
  const resolvedImage = typeof image === 'object' ? image : null

  return (
    <section className={`promo-section promo-section--${orientation}`}>
      {resolvedImage && (
        <div className="promo-section__image">
          <Media resource={resolvedImage} imgClassName="promo-section__img" />
        </div>
      )}
      <div className="promo-section__content">
        <h2 className="promo-section__headline">{headline}</h2>
        {body && <p className="promo-section__body">{body}</p>}
        {enableLink && link && <CMSLink {...link} className="promo-section__link" />}
      </div>
    </section>
  )
}
