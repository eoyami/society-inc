import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Society Inc - Portal de Notícias',
  description: 'Seu portal de notícias sobre games, tecnologia e cultura pop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
