import { isFlagEnabled } from '@/utilities/flags'
import PageTemplate, { generateMetadata } from './[slug]/page'
import { HomePage } from '@/components/HomePage'

export { generateMetadata }

export default async function Page() {
  const homepageAsCode = await isFlagEnabled('enable-homepage-as-code')

  if (homepageAsCode) {
    return <HomePage />
  }

  return <PageTemplate params={Promise.resolve({})} />
}
