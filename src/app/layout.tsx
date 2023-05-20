import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next Auth App",
  description: "Auth App Using Next-Auth",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full scroll-smooth antialiased`}
    >
      <body className="flex flex-col h-full">
        <Provider>
          <main className="grow">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
