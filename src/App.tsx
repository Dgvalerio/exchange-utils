import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home';
import OpenPullRequests from './open-pull-requests';

const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/open-pull-requests" element={<OpenPullRequests />} />
    </Routes>
  </BrowserRouter>
);

export default App;
