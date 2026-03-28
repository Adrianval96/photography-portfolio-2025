import Image from 'next/image'
import type { Homepage, Media } from '@/payload-types'
import './styles.css'

type Props = {
  data: Homepage
}

export function About({ data }: Props) {
  const { photo, name, bio } = data.aboutSection ?? {}
  if (!photo || typeof photo === 'number' || !name || !bio) return null
  const media = photo as Media

  return (
    <section className="about">
      <div className="about__photo">
        {media.url && (
          <Image
            src={media.url}
            alt={media.alt ?? name}
            fill
            className="about__image"
          />
        )}
      </div>
      <div className="about__text">
        <span className="about__label">About</span>
        <h2 className="about__name">{name}</h2>
        <p className="about__bio">{bio}</p>
      </div>
    </section>
  )
}
