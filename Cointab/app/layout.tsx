import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cointab ChatGPT-style App',
  description: 'Local ChatGPT-style application powered by Ollama gemma:1b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
