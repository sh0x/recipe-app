import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'RecipeBook', description: 'Your private cookbook of tested winners.' };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body>
        <div className="container py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">RecipeBook</h1>
            <nav className="flex gap-3">
              <a className="btn" href="/">Recipes</a>
              <a className="btn" href="/import">Import</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
