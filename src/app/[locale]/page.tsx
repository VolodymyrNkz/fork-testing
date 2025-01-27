import React from 'react';
import Experiences from '@/app/_components/Experiences';
import FAQ from '@/app/_components/Faq';
import { LandingSearch } from '@/app/_components/LandingSearch';
import { FAQ_ITEMS } from '@/app/const';

const Home = () => {
  return (
    <>
      <LandingSearch />
      <Experiences />
      <FAQ items={FAQ_ITEMS} />
    </>
  );
};

export default Home;
