import React, { FC, useEffect, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { IPullRequest } from './types/PullRequest.interface';

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
  // INSIRA AQUI O SEU TOKEN DO GITHUB
  const token = '';

  const api = axios.create({
    baseURL: 'https://api.github.com/',
    headers: { Authorization: `token ${token}` },
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
      created_at: new Date(pr.created_at).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      title: pr.title,
      body: pr.body,
      url: pr.html_url,
    }));
  });

  const prs: IPR[][] = await Promise.all(prsPromise);

  return prs.reduce((previousValue, current) => previousValue.concat(current));
};

const App: FC = () => {
  const [prs, setPrs] = useState<IPR[]>([]);

  useEffect(() => {
    main().then((response) => setPrs(response));
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid xs={12} sx={{ padding: '2rem 1rem 1rem 1rem' }}>
          <Typography variant="h2">Pull Requests</Typography>
        </Grid>
        {prs.map((pr) => (
          <Grid xs={4} sx={{ padding: 1 }}>
            <Card key={pr.title}>
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
              <CardActions disableSpacing>
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
