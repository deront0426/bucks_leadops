import "./globals.css";

export const metadata = {
  title: "Bucks for Buckets — Lead Ops",
  description: "Lead tracking and dispatch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
