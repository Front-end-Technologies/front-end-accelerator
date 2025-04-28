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

export interface GithubMember {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
  user_view_type: string;
}

// TODO: infer the type with nesxt auth module
export interface GitHubSession extends Session {
  token: {
    access_token: string;
  };
}

export interface GithubUser {
  avatar_url: string;
  bio: string;
  blog: string;
  company: string;
  created_at: string;
  email: string;
  events_url: string;
  followers: number;
  followers_url: string;
  following: number;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  hireable: string;
  html_url: string;
  id: number;
  location: string;
  login: string;
  name: string;
  node_id: string;
  organizations_url: string;
  public_gists: number;
  public_repos: number;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  twitter_username: string;
  type: string;
  updated_at: string;
  url: string;
  user_view_type: string;
}

export interface WebcontainerFileSystem {
  [key: string]: Directory | File;
}
