import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

import LoginTerminal from "./login-terminal";

export function LoginScreen() {
  return (
    <div className="h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:block">
        <iframe
          height={"100%"}
          id="loginIframe"
          title="Loading Preview"
          width={"100%"}
        ></iframe>
      </div>
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-8 p-4">
        <h1 className="text-2xl font-bold text-black">Front-end Accelerator</h1>
        <p className="mx-auto text-center lg:w-2/4">
          The monorepo playground for your latest Front-end ideas. Learn with
          our <strong className="text-black">cookbook</strong>, get a head start
          with our <strong className="text-black">templates</strong>, and build
          your own projects with our{" "}
          <strong className="text-black">examples</strong>.
          <br />
          <br />
          Go ahead and run a Vite app in the terminal below with <br />
          <strong className="text-green-500">npm create vite@latest</strong>
          <br />
        </p>
        <p className="mx-auto w-2/4 text-center">
          Don&apos;t forget to{" "}
          <strong className="text-green-500">npm run dev</strong> to start the
          development server.
        </p>

        <LoginTerminal />

        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
          className="flex w-full justify-center"
        >
          <Button size="lg">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Or login with GitHub
          </Button>
        </form>
        <div className="space-y-4 text-center text-sm">
          <div className="space-x-4">
            <a
              className="underline underline-offset-4"
              href="https://teams.microsoft.com/l/channel/19:8bdffdee89c246269823f2115b132307%40thread.skype/%f0%9f%9b%a1%20Guild-%20Front-end%20Technologies?groupId=b67aefa2-14a5-4104-9c25-a54fdd0c2a11&tenantId=42151053-0193-47aa-9e81-effd81f772cc"
              rel="noreferrer"
              target="_blank"
            >
              #Teams
            </a>
            <a
              className="underline underline-offset-4"
              href="https://cegeka.slack.com/?redir=%2Farchives%2FC084M8ZJYD9%3Fname%3DC084M8ZJYD9"
              rel="noreferrer"
              target="_blank"
            >
              #Slack
            </a>
          </div>

          <p className="text-muted-foreground text-sm text-balance">
            <a
              className="underline underline-offset-4"
              href="https://cegekagroup.sharepoint.com/sites/O-AP-ApplicationsGeneral/SitePages/Front-end-Technologies.aspx"
              rel="noreferrer"
              target="_blank"
            >
              #Front-end Technologies Guild
            </a>
          </p>
          <picture>
            <img
              alt="Cegeka Logo"
              className="mx-auto mt-8 h-10 w-auto"
              src="/cegeka-logo.svg"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
