import React from 'react'
import type { MediaGroupBlock as MediaGroupBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import './styles.css'

type MediaGroupItem = {
  media: any
  caption?: any
}

type Props = MediaGroupBlockProps & {
  className?: string
  imgClassName?: string
  captionClassName?: string
}

export const MediaGroupBlock: React.FC<Props> = ({
  mediaItems,
  className,
  imgClassName,
  captionClassName,
}) => {
  if (!mediaItems || mediaItems.length === 0) return null

  return (
    <div className={cn('media-group-container', className)}>
      {mediaItems.map((item: MediaGroupItem, i: number) => (
        <div key={i} className="media-group-item">
          <Media imgClassName={cn('media-image', imgClassName)} resource={item.media} />
          {item.caption && (
            <div className={cn('media-caption', captionClassName)}>
              <RichText data={item.caption} enableGutter={false} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
