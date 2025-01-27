'use client';
import { useEffect, useState } from 'react';
import { ProductsResponse } from '../_interfaces/product-response.interface';
import { getDefaultHeaders } from '../_constants/api';
import { useRequest } from '@/app/_hooks/useRequest';

export const useProducts = (city: string, sections: any[]) => {
  const [data, setData] = useState<ProductsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const createRequest = useRequest();

  useEffect(() => {
    if (!city || !sections.length) return;

    (async () => {
      setLoading(true);

      const res = await createRequest<ProductsResponse[], { city: string; sections: any[] }>({
        endpoint: '/products',
        headers: getDefaultHeaders(),
        body: { city, sections },
      });

      setData(res);
      setLoading(false);
    })();
  }, [city, sections.length]);

  return { data, loading };
};
