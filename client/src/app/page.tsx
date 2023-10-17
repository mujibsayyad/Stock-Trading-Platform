'use client';
import { FC } from 'react';
import WithAuth from './middleware/WithAuth';
import HomePage from './components/HomePage';

const Home: FC = () => {

  return (
    <>
      <HomePage />
    </>
  );
};

export default WithAuth(Home, true) as FC;
