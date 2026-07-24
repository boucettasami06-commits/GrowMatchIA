import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'GlowMatch - Your Personal AI Beauty Coach',
  description:
    'Get a personalized skincare routine in 5 minutes. Track your progress and achieve your beauty goals with AI guidance.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
