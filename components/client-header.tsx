'use client'

import dynamic from 'next/dynamic'

// Define the props type based on the original Header component
type HeaderProps = {
  lang: string
  dictionary: {
    home: string
    concepts: string
    works: string
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