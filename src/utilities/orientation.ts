export type Orientation = 'portrait' | 'landscape' | 'square'

export interface ImageDimensions {
  width: number
  height: number
}

export function getDimensionsFromImage(img: HTMLImageElement): ImageDimensions {
  return { width: img.naturalWidth, height: img.naturalHeight }
}

export function getOrientation({ width, height }: ImageDimensions): Orientation {
  if (width > height) return 'landscape'
  if (width < height) return 'portrait'
  return 'square'
}
