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

interface ItemProps {
  link: string;
  text: string;
}

const Item: FC<ItemProps> = ({ text, link }) => (
  <Grid item xs={12}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActions disableSpacing sx={{ marginTop: 'auto' }}>
        <Button href={link} fullWidth>
          {text}
        </Button>
      </CardActions>
    </Card>
  </Grid>
);

const Home: FC = () => {
  const pages: ItemProps[] = [
    { link: '/open-pull-requests', text: 'Revisar Pull Requests Abertos' },
    { link: '/online-routes', text: 'Checar rotas online' },
    { link: '/personal-commits', text: 'Pesquisar commits' },
  ];

  return (
    <Container sx={{ padding: '2rem 0' }}>
      <Grid
        container
        alignItems="stretch"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="h2">Exchange Utils</Typography>
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: '1rem' }}>
          <Divider />
        </Grid>
        {pages.map((page) => (
          <Item link={page.link} text={page.text} />
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
