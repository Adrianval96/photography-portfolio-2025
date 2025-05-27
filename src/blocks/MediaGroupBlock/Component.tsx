import React from 'react'
import type { MediaGroupBlock as MediaGroupBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

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
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6', className)}>
      {mediaItems.map((item: MediaGroupItem, i: number) => (
        <div key={i} className="flex flex-col">
          <Media
            imgClassName={cn('rounded-[0.8rem] border border-border', imgClassName)}
            resource={item.media}
          />
          {item.caption && (
            <div className={cn('mt-4', captionClassName)}>
              <RichText data={item.caption} enableGutter={false} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
