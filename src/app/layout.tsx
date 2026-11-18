import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parenting Support Coach",
  description: "A calm, practical parenting support companion."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
