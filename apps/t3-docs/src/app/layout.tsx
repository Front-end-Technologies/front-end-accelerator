import "@/styles/globals.css";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { LoginScreen } from "@/components/login-screen";
import { SidebarInset } from "@/components/ui/sidebar";
import { Providers } from "@/trpc/react";
import { api, HydrateClient } from "@/trpc/server";
import { type Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { Header } from "./header";
import Main from "./main";

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
  const [session] = await Promise.all([
    auth(),
    api.gitHub.getFolders.prefetch(),
  ]);

  return (
    <html
      className={`${geistMono.variable}`}
      lang="en"
      // Required for shadCNui light dark theme
      suppressHydrationWarning
    >
      <body>
        {session ? (
          <Providers>
            <HydrateClient>
              <AppSidebar />
              <SidebarInset>
                <Header />
                <Main>{children}</Main>
              </SidebarInset>
            </HydrateClient>
          </Providers>
        ) : (
          <LoginScreen />
        )}
      </body>
    </html>
  );
}
