import React, { FC } from 'react';

import {
  Button,
  Card,
  CardActions,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

const Home: FC = () => {
  return (
    <Container sx={{ padding: '2rem 0' }}>
      <Grid container alignItems="stretch" justifyContent="space-between">
        <Grid item xs={12}>
          <Typography variant="h2">Exchange Utils</Typography>
        </Grid>
        <Grid item xs={12} sx={{ padding: '1rem 0' }}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardActions disableSpacing sx={{ marginTop: 'auto' }}>
              <Button href="/open-pull-requests" fullWidth>
                Revisar Pull Requests Abertos
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
