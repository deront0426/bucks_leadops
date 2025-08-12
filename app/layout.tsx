<span className="font-semibold">Bucks for Buckets — vTEST</span>
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Bucks for Buckets — Lead Ops",
  description: "Modern lead, dispatch, and messaging dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 rounded-2xl bg-brand-500" />
              <span className="font-semibold">Bucks for Buckets</span>
            </div>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              <Link className="hover:text-brand-600" href="/">Dashboard</Link>
              <Link className="hover:text-brand-600" href="/drivers">Drivers</Link>
              <Link className="hover:text-brand-600" href="/sell-my-car">Public Form</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
