import React from 'react';
import { Navigation } from '@/app/[locale]/results/_components/Navigation';
import { ProductList } from '@/app/[locale]/results/_components/ResultList';

export default async function Results() {
  return (
    <>
      <Navigation />
      <ProductList />
    </>
  );
}
