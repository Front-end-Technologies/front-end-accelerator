import "@/styles/globals.css";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { LoginScreen } from "@/components/login-screen";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { Main } from "./main";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "Speed up your front-end development workflow",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: "Front-end Accelerator",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<Props>) {
  const session = await auth();

  return (
    <html className={`${geistMono.variable}`} lang="en">
      <body>
        {session ? (
          <TRPCReactProvider>
            <AppSidebar />
            <Main>{children}</Main>
          </TRPCReactProvider>
        ) : (
          <LoginScreen />
        )}
      </body>
    </html>
  );
}
