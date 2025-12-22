export const metadata = {
  title: "Feedbot",
  description: "Delivering Insights Lightspeed",
};

import "./globals.css";
import { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
