import type { Homepage } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import './styles.css'

type Props = {
  data: Homepage
}

export function HeroSection({ data }: Props) {
  const { heroImage, heroHeadline, heroSubline, cta } = data

  return (
    <section className="hero-section">
      {typeof heroImage === 'object' && (
        <Media
          fill
          imgClassName="hero-section__image"
          pictureClassName="hero-section__picture"
          priority
          resource={heroImage}
        />
      )}
      <div className="hero-section__content">
        <h1 className="hero-section__headline">{heroHeadline}</h1>
        {heroSubline && <p className="hero-section__subline">{heroSubline}</p>}
        <CMSLink {...cta} className="hero-section__cta" />
      </div>
    </section>
  )
}
