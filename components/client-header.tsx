'use client'

import dynamic from 'next/dynamic'

// Remove dictionary from props type
type HeaderProps = {
  lang: string
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