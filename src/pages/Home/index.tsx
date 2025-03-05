import { HomeContainer } from './styles';
import React from 'react';

const Home = () => {
  const data: number = 'lkjhgfd';
  return (
    <HomeContainer>
      Welcome to the Home Page!
      <div>{data}</div>
    </HomeContainer>
  );
};

export default Home;
