import type { Metadata } from "next";
import { Fraunces, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/ui/NavBar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

// Official typography for the rendered art (Instagram posts) — kept
// separate from the app's own UI fonts above.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-art",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Studio de Conteúdo",
  description: "Transforme uma ideia em um post pronto para publicar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-paper text-ink">
        <NavBar />
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
      </body>
    </html>
  );
}
