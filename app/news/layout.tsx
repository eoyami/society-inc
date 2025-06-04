import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Society Inc - Notícias',
  description: 'Lista completa de notícias',
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 