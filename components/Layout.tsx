import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import Header from './Header';
import Footer from './Footer';
import Toaster from './Toaster';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </div>
    </SessionProvider>
  );
}