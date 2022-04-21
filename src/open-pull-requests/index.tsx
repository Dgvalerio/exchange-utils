import React, { FC, ReactElement, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { RefreshOutlined } from '@mui/icons-material';
import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  colors,
  Container,
  darken,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { IPullRequest } from '../types/PullRequest.interface';

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

    return data
      .filter((pr) => pr.user.login !== 'dependabot[bot]')
      .map((pr) => ({
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

const OpenPullRequests: FC = () => {
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
        <Grid item xs={10} sx={{ padding: '2rem 1rem 1rem 1rem' }}>
          <Typography variant="h2">Pull Requests</Typography>
        </Grid>
        <Grid item alignSelf="center">
          <IconButton onClick={loadPRs}>
            <RefreshOutlined sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
        {prs.map((pr) => (
          <Grid item xs={4} sx={{ padding: 1 }} key={pr.title}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardHeader
                avatar={<Avatar alt={pr.user.login} src={pr.user.avatar} />}
                title={<Typography variant="subtitle1">{pr.title}</Typography>}
                subheader={pr.created_at}
              />
              <CardContent
                sx={{
                  flex: 1,
                  backgroundColor: darken(colors.grey['900'], 0.3),
                }}
              >
                <ReactMarkdown
                  children={pr.body}
                  components={{
                    h1: ({ children }): ReactElement => (
                      <Typography variant="h4">{children}</Typography>
                    ),
                    h2: ({ children }): ReactElement => (
                      <Typography variant="h5">{children}</Typography>
                    ),
                    h3: ({ children }): ReactElement => (
                      <Typography variant="h6">{children}</Typography>
                    ),
                    p: ({ children }): ReactElement => (
                      <Typography variant="body1">{children}</Typography>
                    ),
                    ul: ({ children }): ReactElement => <List>{children}</List>,
                    li: ({ children }): ReactElement => {
                      const text: string = `${children[0]}`;

                      if (text[0] === '[')
                        return (
                          <ListItem>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={text[1] !== ' '}
                                  disableRipple
                                />
                              }
                              label={text.slice(3)}
                            />
                          </ListItem>
                        );
                      else return <ListItem>{text}</ListItem>;
                    },
                    a: ({ children, href }): ReactElement => (
                      <Button href={href || '#'} target="_blank">
                        {children}
                      </Button>
                    ),
                  }}
                />
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

export default OpenPullRequests;
