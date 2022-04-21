import React, { FC, useEffect, useState } from 'react';

import { OpenInNew } from '@mui/icons-material';
import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  colors,
  Container,
  darken,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { ICollaboratorView } from '../types/Collaborator.interface';
import { ICommitView } from '../types/Commit.interface';
import { getCollaborators, getCommits } from '../utils/api';

const PersonalCommits: FC = () => {
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<ICommitView[]>([]);
  const [collaborators, setCollaborators] = useState<ICollaboratorView[]>([]);
  const [user, setUser] = useState<ICollaboratorView>({
    login: '',
    avatar_url: '',
  });

  const loadCollaborators = async (): Promise<void> => {
    setLoading(true);

    const response = await getCollaborators();

    setCollaborators(response);
    setLoading(false);
  };

  const loadCommits = async (user: string): Promise<void> => {
    setLoading(true);

    const response = await getCommits(user);

    setCommits(response);
    setLoading(false);
  };

  const changeUser = (event: React.SyntheticEvent, value: string): void => {
    const anCollaborator = collaborators.find(({ login }) => value === login);

    if (!anCollaborator) return;

    console.log({ anCollaborator, value });

    setUser(anCollaborator);
    void loadCommits(value);
  };

  useEffect(() => {
    void loadCollaborators();
  }, []);

  useEffect(() => {
    console.log({ user });
  }, [user]);

  return (
    <Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container alignItems="stretch" justifyContent="space-between">
        <Grid item xs={12} sx={{ padding: '2rem 1rem 1rem 1rem' }}>
          <Typography variant="h2">Personal Commits</Typography>
        </Grid>
        <Grid item xs={12} sx={{ padding: 1 }}>
          <Paper component={Grid} container>
            <Grid item xs={4} sx={{ padding: 2 }}>
              <Autocomplete
                disablePortal
                options={collaborators}
                getOptionLabel={(option): string => option.login}
                renderOption={(props, option): JSX.Element => (
                  <Box
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="32"
                      src={option.avatar_url}
                      srcSet={option.avatar_url}
                      alt={option.login}
                    />
                    {option.login}
                  </Box>
                )}
                sx={{ width: 300 }}
                renderInput={(params): JSX.Element => (
                  <TextField {...params} label="Usuário" />
                )}
                inputValue={user.login}
                onInputChange={changeUser}
              />
            </Grid>
          </Paper>
        </Grid>
        {commits.length === 0 ? (
          <Grid item xs={12} sx={{ padding: '0.25rem 0.5rem' }}>
            <Grid container component={Card}>
              <Grid
                item
                xs={4}
                component={CardHeader}
                title={
                  <Typography variant="subtitle1">
                    Não há commits para serem mostrados.
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        ) : (
          commits.map((commit) => (
            <Grid
              item
              xs={12}
              sx={{ padding: '0.25rem 0.5rem' }}
              key={commit.sha}
            >
              <Grid container component={Card}>
                <Grid
                  item
                  xs={4}
                  component={CardHeader}
                  avatar={
                    <Avatar
                      alt={commit.author.login}
                      src={commit.author.avatar}
                    />
                  }
                  title={
                    <Typography variant="subtitle1">
                      <b>{commit.author.login}</b> on <em>{commit.repo}</em>
                    </Typography>
                  }
                  subheader={commit.committed_at}
                />
                <Grid
                  item
                  xs={7}
                  component={CardContent}
                  sx={{
                    flex: 1,
                    backgroundColor: darken(colors.grey['900'], 0.3),
                  }}
                >
                  <Typography variant="body1">{commit.message}</Typography>
                </Grid>
                <Grid item xs={1} component={CardActions} disableSpacing>
                  <IconButton
                    color="primary"
                    href={commit.url}
                    target="_blank"
                    sx={{ margin: 'auto' }}
                  >
                    <OpenInNew />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default PersonalCommits;
