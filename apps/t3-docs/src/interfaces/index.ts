import { Session } from "next-auth";

export interface Directory {
  directory: {
    [key: string]: Directory | File;
  };
}

export interface File {
  file: {
    contents: string;
  };
}

export interface GitHubContent {
  _links: {
    git: string;
    html: string;
    self: string;
  };
  contents?: GitHubContent[] | string;
  download_url: string;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
  url: string;
}

// TODO: infer the type with nesxt auth module
export interface GitHubSession extends Session {
  token: {
    access_token: string;
  };
}

export interface WebcontainerFileSystem {
  [key: string]: Directory | File;
}
