import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Rahul Gautam | Senior Tech Expert – Platform & IT Resilience",
  description:
    "Technology executive with 17 years leading digital transformation, AI, and platform programs for Fortune 500 clients. MBA – IIM Calcutta. McKinsey & Company.",
  keywords: [
    "Rahul Gautam",
    "Senior Tech Expert",
    "McKinsey",
    "Digital Transformation",
    "AI Platform",
    "IT Resilience",
    "Enterprise Architecture",
    "AWS",
    "Azure",
    "Salesforce",
    "IIM Calcutta",
    "MIT Sloan",
    "GenAI",
    "Agentic AI",
  ],
  authors: [{ name: "Rahul Gautam" }],
  openGraph: {
    title: "Rahul Gautam | Senior Tech Expert",
    description:
      "Technology executive with 17 years leading digital transformation, AI, and platform programs at McKinsey, Accenture, KPMG across 15+ countries.",
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
