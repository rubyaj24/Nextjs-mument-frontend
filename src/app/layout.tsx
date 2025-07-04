import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "μment - Kickstart Your Project Journey",
  description: "μment is a platform designed to help you kickstart your project journey with ease. Explore our features and get started today!",
  openGraph: {
    title: "μment - Kickstart Your Project Journey",
    description: "μment is a platform designed to help you kickstart your project journey with ease. Explore our features and get started today!",
    url: "https://mument-2025.vercel.app",
    siteName: "μment",
    // images: [{}],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
