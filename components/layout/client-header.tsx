'use client'

import dynamic from 'next/dynamic'

// Add dictionary prop back
type HeaderProps = {
  lang: string
  dictionary: {
    participate: string
    // Add other header keys if needed later
  }
}

// Dynamically import the actual Header component with ssr: false
const DynamicHeader = dynamic(() => import('./header').then(mod => mod.Header), {
  ssr: false,
  // Optional: Add a loading component
  // loading: () => <p>Loading Header...</p>,
})

// Export the wrapper component
export function ClientHeader(props: HeaderProps) {
  return <DynamicHeader {...props} />
} 