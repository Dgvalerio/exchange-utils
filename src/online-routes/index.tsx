import React, { FC, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Check, ErrorOutline, RefreshOutlined } from '@mui/icons-material';
import {
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
import axios, { AxiosResponse } from 'axios';

interface RepoStatus {
  name: string;
  url: string;
  online: boolean;
  response: AxiosResponse | Error;
}

const main = async (): Promise<RepoStatus[]> => {
  const repos: Pick<RepoStatus, 'name' | 'url'>[] = [
    { name: 'Exchange.Admin', url: 'https://exchange.admin.k8s.luby.me' },
    { name: 'Exchange.Fullnode', url: 'http://35.179.81.10:8082' },
    { name: 'Exchange.MS.Admin', url: 'https://exchange.ms.admin.k8s.luby.me' },
    { name: 'Exchange.MS.Audit', url: 'https://exchange.ms.audit.k8s.luby.me' },
    {
      name: 'Exchange.MS.Crypto',
      url: 'https://exchange.ms.crypto.k8s.luby.me',
    },
    { name: 'Exchange.MS.Fiat', url: 'https://exchange.ms.eur.k8s.luby.me' },
    {
      name: 'Exchange.MS.Transactions',
      url: 'https://exchange.ms.transactions.k8s.luby.me',
    },
    { name: 'Exchange.MS.User', url: 'https://exchange.ms.user.k8s.luby.me' },
    {
      name: 'Exchange.TradingView',
      url: 'https://exchange.trading.k8s.luby.me',
    },
    { name: 'Exchange.Web', url: 'https://exchange.web.k8s.luby.me' },
    {
      name: 'Exchange.Websocket',
      url: 'https://exchange.websocket.k8s.luby.me',
    },
  ];

  const reposPromise = repos.map(async (repo) => {
    try {
      const response = await axios.get(repo.url);

      console.log({ ...repo, response });

      return { ...repo, online: true, response };
    } catch (e) {
      console.log({ ...repo, response: e });

      return { ...repo, online: false, response: e as Error };
    }
  });

  return await Promise.all(reposPromise);
};

const OnlineRoutes: FC = () => {
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<RepoStatus[]>([]);

  const loadRoutes = async (): Promise<void> => {
    setLoading(true);

    const response = await main();

    setRepos(response);
    setLoading(false);
  };

  useEffect(() => {
    void loadRoutes();
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
        <Grid item xs={10} sx={{ padding: '2rem 1rem 1rem 1rem' }}>
          <Typography variant="h2">Rotas online</Typography>
        </Grid>
        <Grid item alignSelf="center">
          <IconButton onClick={loadRoutes}>
            <RefreshOutlined sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
        {repos.map((repo) => (
          <Grid item xs={4} sx={{ padding: 1 }} key={repo.name}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardHeader
                avatar={
                  repo.online ? (
                    <Check color="success" />
                  ) : (
                    <ErrorOutline color="error" />
                  )
                }
                title={<Typography variant="subtitle1">{repo.name}</Typography>}
              />
              <CardContent sx={{ padding: 0 }}>
                <SyntaxHighlighter
                  language="javascript"
                  style={theme}
                  wrapLongLines
                  showLineNumbers
                  customStyle={{ maxHeight: '24rem' }}
                >
                  {JSON.stringify(repo.response)
                    .replaceAll('{', '{\n  ')
                    .replaceAll('}', '\n}')
                    .replaceAll(':', ': ')
                    .replaceAll(',"', ',\n  "')}
                </SyntaxHighlighter>
              </CardContent>
              <CardActions disableSpacing sx={{ marginTop: 'auto' }}>
                <Button href={repo.url} target="_blank">
                  Abrir URL
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OnlineRoutes;
