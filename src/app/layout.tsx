// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ApolloProviderWrapper } from '@/components/ApolloProviderWrapper';

export const metadata: Metadata = {
  title: 'CampaignHQ – Marketing Analytics Dashboard',
  description: 'High-performance marketing analytics dashboard for performance teams.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}
