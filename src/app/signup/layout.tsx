import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign up | μment",
  description: "μment is a platform designed to help you kickstart your project journey with ease. Explore our features and get started today!",
  openGraph: {
    title: "μment - Kickstart Your Project Journey",
    description: "μment is a platform designed to help you kickstart your project journey with ease. Explore our features and get started today!",
    url: "https://mument-2025.vercel.app",
    siteName: "μment",
    locale: "en_US",
    type: "website",
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}