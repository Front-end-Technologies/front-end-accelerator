import "@/styles/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { LoginScreen } from "@/components/login-screen";
import { api, HydrateClient } from "@/trpc/server";
import { type Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { auth } from "../server/auth";
import { TRPCReactProvider } from "../trpc/react";
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

  if (session) {
    void api.gitHub.getFolders.prefetch();
  }

  return (
    <html className={`${geistMono.variable}`} lang="en">
      <body>
        {session ? (
          <TRPCReactProvider>
            <HydrateClient>
              <AppSidebar />
              <Main>{children}</Main>
            </HydrateClient>
          </TRPCReactProvider>
        ) : (
          <LoginScreen />
        )}
      </body>
    </html>
  );
}
