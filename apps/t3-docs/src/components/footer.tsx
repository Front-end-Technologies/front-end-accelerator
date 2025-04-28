export function Footer() {
  return (
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
  );
}
