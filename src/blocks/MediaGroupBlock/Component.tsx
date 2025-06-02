import React from 'react'
import type { MediaGroupBlock as MediaGroupBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import './styles.css'

type MediaGroupItem = {
  media: any
  caption?: any
}

export const MediaGroupBlock: React.FC<MediaGroupBlockProps> = ({ mediaItems }) => {
  if (!mediaItems || mediaItems.length === 0) return null

  return (
    <div className="media-group-container">
      {mediaItems.map(
        (item: MediaGroupItem, i: number) =>
          item.media && (
            <div key={i} className="media-group-item">
              <Media imgClassName="media-image" resource={item.media} />
              {item.caption && (
                <div className="media-caption">
                  <RichText data={item.caption} enableGutter={false} />
                </div>
              )}
            </div>
          ),
      )}
    </div>
  )
}
