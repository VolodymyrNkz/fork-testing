import { API_ROUTE_PREFIX, getDefaultHeaders } from '@/app/_constants/api';

interface RequestOptions<T> {
  endpoint: string;
  body?: T;
  method?: 'POST' | 'GET';
  headers?: HeadersInit;
}

export async function createRequest<Response, Body = undefined>({
  endpoint,
  body,
  method = 'POST',
  headers = getDefaultHeaders(),
}: RequestOptions<Body>): Promise<Response> {
  const response = await fetch(`${API_ROUTE_PREFIX}${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return await response.json();
}
