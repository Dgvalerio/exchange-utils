import { IParent } from './Parent.interface';
import { ISimpleUser, IUser } from './User.interface';

export interface ICommitTree {
  sha: string;
  url: string;
}

export interface ICommitVerification {
  verified: boolean;
  reason: 'valid' | 'unsigned';
  signature: string | null;
  payload: string | null;
}

export interface ISimpleCommit {
  author: ISimpleUser;
  committer: ISimpleUser;
  message: string;
  tree: ICommitTree;
  url: string;
  comment_count: 0;
  verification: ICommitVerification;
}

export interface ICommit {
  sha: string;
  node_id: string;
  commit: ISimpleCommit;
  url: string;
  html_url: string;
  comments_url: string;
  author: IUser;
  committer: IUser;
  parents: IParent[];
}

export interface ICommitView {
  repo: string;
  author: { login: string; avatar: string };
  committer: { login: string; avatar: string };
  message: string;
  sha: string;
  url: string;
  committed_at: string;
}
