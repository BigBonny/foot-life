import { EnhancedHero } from '@/components/enhanced-hero'
import { AnimatedBestSellers } from '@/components/animated-best-sellers'
import { EnhancedInfluencers } from '@/components/enhanced-influencers'
import { AnimatedFeatures } from '@/components/animated-features'
import { EnhancedNewsletter } from '@/components/enhanced-newsletter'

export default function Home() {
  return (
    <>
      <EnhancedHero />
      <AnimatedBestSellers />
      {/* <EnhancedInfluencers /> */}
      <AnimatedFeatures />
      <EnhancedNewsletter />
    </>
  )
}
