import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zesdocs - The Smart Link Hub',
  description: 'Organize, search, and discover your saved links with AI-powered features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
