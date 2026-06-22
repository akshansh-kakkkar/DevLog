import { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import LayoutWrapper from './components/layoutwrapper';
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Provider from "./components/Provider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Blog Application",
  description: "A Full Stack Blog Application",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans", geist.variable)}>
      <body className="min-h-screen pt-24 md:pt-10 flex flex-col">
        <Provider>
        <LayoutWrapper>
          {children}
          <Toaster richColors position="top-right" />
        </LayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
