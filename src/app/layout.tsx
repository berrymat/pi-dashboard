import type { Metadata } from "next";
import { Nunito_Sans, Fraunces } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Project Intelligence",
  description: "Cross-project intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:block">
          <Nav />
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6 md:p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
