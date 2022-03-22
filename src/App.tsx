import React, { FC, useEffect, useState } from 'react';

import { RefreshOutlined } from '@mui/icons-material';
import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { IPullRequest } from './types/PullRequest.interface';

interface IPrePR {
  repo: string;
  user: { login: string; avatar: string };
  created_at: Date;
  state: string;
  title: string;
  body: string;
  url: string;
}

interface IPR {
  repo: string;
  user: { login: string; avatar: string };
  created_at: string;
  state: string;
  title: string;
  body: string;
  url: string;
}

const main = async (): Promise<IPR[]> => {
  const api = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
      Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
    },
  });

  const owner = 'lubysoftware';

  const repos = [
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

  const prsPromise = repos.map(async (repo) => {
    const { data } = await api.get<IPullRequest[]>(
      `/repos/${owner}/${repo}/pulls`
    );

    console.log({ data });

    return data.map((pr) => ({
      repo,
      state: pr.state,
      user: { login: pr.user.login, avatar: pr.user.avatar_url },
      created_at: new Date(pr.created_at),
      title: pr.title,
      body: pr.body,
      url: pr.html_url,
    }));
  });

  const prs: IPrePR[][] = await Promise.all(prsPromise);

  const joinedPrs = prs.reduce((previousValue, current) =>
    previousValue.concat(current)
  );

  const organizedByDate = joinedPrs.sort(
    ({ created_at: previous }, { created_at: current }) =>
      previous.getTime() - current.getTime()
  );

  return organizedByDate.map((pr) => ({
    ...pr,
    created_at: pr.created_at.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));
};

const App: FC = () => {
  const [loading, setLoading] = useState(true);
  const [prs, setPrs] = useState<IPR[]>([]);

  const loadPRs = async (): Promise<void> => {
    setLoading(true);

    const response = await main();

    setPrs(response);
    setLoading(false);
  };

  useEffect(() => {
    void loadPRs();
  }, []);

  return (
    <Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container alignItems="stretch" justifyContent="space-between">
        <Grid xs={10} sx={{ padding: '2rem 1rem 1rem 1rem' }}>
          <Typography variant="h2">Pull Requests</Typography>
        </Grid>
        <Grid alignSelf="center">
          <IconButton onClick={loadPRs}>
            <RefreshOutlined sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
        {prs.map((pr) => (
          <Grid xs={4} sx={{ padding: 1 }}>
            <Card
              key={pr.title}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardHeader
                avatar={<Avatar alt={pr.user.login} src={pr.user.avatar} />}
                title={<Typography variant="subtitle1">{pr.title}</Typography>}
                subheader={pr.created_at}
              />
              <CardContent>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ whiteSpace: 'break-spaces' }}
                >
                  {pr.body}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{ marginTop: 'auto' }}>
                <Button href={pr.url} target="_blank">
                  Revisar Pull Request
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
