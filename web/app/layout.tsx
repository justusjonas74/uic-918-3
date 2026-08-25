import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UIC 918-3 BARCODE DECODER",
  description: "Neo-brutalistischer Online-Fahrkarten-Decoder für Bahntickets nach UIC 918.3 Spezifikation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
