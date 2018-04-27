import React from 'react';
import { Nav } from './Nav';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

const LazyBar = Loadable({
  loader: () => import('./Bar'),
  loading: () => <span>loading</span>,
  delay: 350
});

const App = () => (
  <BrowserRouter>
    <>
      <Nav />
      <br />
      <input type="text" />
      <br />
      <br />
      <Link to="bar">Go To Bar</Link>

      <Route path="/bar" component={LazyBar} />
    </>
  </BrowserRouter>
);

export default hot(module)(App);
