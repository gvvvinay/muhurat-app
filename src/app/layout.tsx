import type { Metadata } from "next";
import "./globals.css";
import GoogleOAuthWrapper from "@/components/GoogleOAuthWrapper";

export const metadata: Metadata = {
  title: "Auspicious Time - Muhurat Finder",
  description: "Find the perfect auspicious moments for your important life events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthWrapper>
          {children}
        </GoogleOAuthWrapper>
      </body>
    </html>
  );
}
