import type { Metadata } from "next";
import "./globals.css";
import "antd-mobile/bundle/style.css";

export const metadata: Metadata = {
  title: "Cookbook",
  description: "Cookbook",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-50 bg-[#f7f7f1]"
          // style={{ backgroundImage: "url(/imgs/food005.jpg)" }}
        />
        {children}
      </body>
    </html>
  );
}
