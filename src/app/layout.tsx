import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "neat · muliro · naltic",
  description: "Perfis pessoais",
  openGraph: {
    title: "neat · muliro · naltic",
    description: "Perfis pessoais",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
