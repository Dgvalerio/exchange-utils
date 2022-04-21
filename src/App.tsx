import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home';
import OnlineRoutes from './online-routes';
import OpenPullRequests from './open-pull-requests';
import PersonalCommits from './personal-commits';

const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/open-pull-requests" element={<OpenPullRequests />} />
      <Route path="/online-routes" element={<OnlineRoutes />} />
      <Route path="/personal-commits" element={<PersonalCommits />} />
    </Routes>
  </BrowserRouter>
);

export default App;
