import axios from 'axios';

import {
  ICollaborator,
  ICollaboratorView,
} from '../types/Collaborator.interface';
import { ICommit, ICommitView } from '../types/Commit.interface';
import { IContributor, IContributorView } from '../types/Contributor.interface';
import { formatDate, joinLists, orderByDate } from './index';

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: { Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}` },
});

const owner = 'lubysoftware';

const repositories = [
  'Exchange.Admin',
  'Exchange.App',
  'Exchange.Dev',
  'Exchange.Fullnode',
  'Exchange.Lib',
  'Exchange.MS.Admin',
  'Exchange.MS.Audit',
  'Exchange.MS.Crypto',
  'Exchange.MS.Mail',
  'Exchange.MS.Fiat',
  'Exchange.MS.Transactions',
  'Exchange.MS.User',
  'Exchange.TradingView',
  'Exchange.Web',
  'Exchange.Websocket',
];

export interface GetCommits {
  author: string;
  since?: string;
  until?: string;
}

export const getCommits = async ({
  author,
  until,
  since,
}: GetCommits): Promise<ICommitView[]> => {
  const commitsPromise = repositories.map(
    async (repo): Promise<ICommitView[]> => {
      let url = `/repos/${owner}/${repo}/commits?author=${author}`;

      if (since && since !== '') url += `&since=${since}`;
      if (until && until !== '') url += `&until=${until}`;

      const { data } = await api.get<ICommit[]>(url);

      return data.map((commit) => ({
        repo,
        message: commit.commit.message,
        author: {
          login: commit.author.login,
          avatar: commit.author.avatar_url,
        },
        committer: {
          login: commit.committer.login,
          avatar: commit.committer.avatar_url,
        },
        sha: commit.sha,
        url: commit.html_url,
        committed_at: commit.commit.author.date,
      }));
    }
  );

  const commits: ICommitView[][] = await Promise.all(commitsPromise);

  const joinedCommits = joinLists(commits);

  const organizedByDate = orderByDate(joinedCommits, 'committed_at', 'asc');

  return organizedByDate.map((commit) => ({
    ...commit,
    committed_at: formatDate(commit.committed_at),
  }));
};

export const getCollaborators = async (): Promise<ICollaboratorView[]> => {
  const responsePromise = repositories.map(
    async (repo): Promise<ICollaboratorView[]> => {
      const { data } = await api.get<ICollaborator[]>(
        `/repos/${owner}/${repo}/collaborators`
      );

      return data.map((item) => ({
        login: item.login,
        avatar_url: item.avatar_url,
      }));
    }
  );

  const items: ICollaboratorView[][] = await Promise.all(responsePromise);

  const joined = joinLists(items);

  const withoutDuplicates: ICollaboratorView[] = [];

  joined.forEach((item) => {
    const exists = withoutDuplicates.find(({ login }) => login === item.login);

    if (!exists) withoutDuplicates.push(item);
  });

  return withoutDuplicates.sort((p, c) => {
    if (p.login > c.login) return 1;
    if (p.login < c.login) return -1;

    return 0;
  });
};

export const getContributors = async (): Promise<IContributorView[]> => {
  const responsePromise = repositories.map(
    async (repo): Promise<IContributorView[]> => {
      const { data } = await api.get<IContributor[]>(
        `/repos/${owner}/${repo}/contributors`
      );

      return data.map((item) => ({
        login: item.login,
        avatar_url: item.avatar_url,
      }));
    }
  );

  const items: IContributorView[][] = await Promise.all(responsePromise);

  const joined = joinLists(items);

  const withoutDuplicates: IContributorView[] = [];

  joined.forEach((item) => {
    const exists = withoutDuplicates.find(({ login }) => login === item.login);

    if (!exists) withoutDuplicates.push(item);
  });

  return withoutDuplicates.sort((p, c) => {
    if (p.login > c.login) return 1;
    if (p.login < c.login) return -1;

    return 0;
  });
};
