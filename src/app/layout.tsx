import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rahul Gautam | Senior Tech Expert – Platform & IT Resilience",
  description:
    "Senior Tech Expert with 17+ years architecting cloud-native data platforms. MBA – IIM Calcutta. McKinsey & Company. AWS, Azure, Salesforce Architect.",
  keywords: [
    "Rahul Gautam",
    "Senior Tech Expert",
    "McKinsey",
    "Cloud Architecture",
    "IT Resilience",
    "Enterprise Architecture",
    "AWS",
    "Azure",
    "Salesforce",
    "IIM Calcutta",
    "MIT Sloan",
  ],
  authors: [{ name: "Rahul Gautam" }],
  openGraph: {
    title: "Rahul Gautam | Senior Tech Expert",
    description:
      "17+ years architecting cloud-native data platforms at McKinsey, Accenture, KPMG, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased" style={{ background: "var(--bg)", color: "var(--text-1)", transition: "background 0.4s ease, color 0.4s ease" }}>
        {children}
      </body>
    </html>
  );
}
