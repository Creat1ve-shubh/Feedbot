export const metadata = {
  title: "Feedbot",
  description: "Brand perception insights",
};

import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto">{children}</div>
      </body>
    </html>
  );
}
