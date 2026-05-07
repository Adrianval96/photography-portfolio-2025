export type Orientation = 'portrait' | 'landscape' | 'square'

export interface ImageDimensions {
  width: number
  height: number
}

export function getOrientation({ width, height }: ImageDimensions): Orientation {
  return getOrientationFromDimensions(width, height)
}

export function getOrientationFromDimensions(width: number, height: number): Orientation {
  if (width > height) return 'landscape'
  if (width < height) return 'portrait'
  return 'square'
}
