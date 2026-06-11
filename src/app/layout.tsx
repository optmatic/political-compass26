import type { Metadata } from "next";
import { Alegreya, Exo_2 } from "next/font/google";
import "./globals.css";

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-alegreya",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OptiPol",
  description:
    "Fuck the binary. Multi-axis political compass with radar chart results.",
  openGraph: {
    title: "OptiPol",
    description: "Politics is not a fucking sport. Eight axes. One portrait of where you stand.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${alegreya.variable} ${exo2.variable} h-full`}>
      <body className="min-h-full bg-void font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
