import { useModal } from '@/app/_contexts/modalContext';
import { API_ROUTE_PREFIX, API_ROUTES, getDefaultHeaders } from '@/app/_constants/api';

interface RequestOptions<T> {
  endpoint: string;
  body?: T;
  method?: 'POST' | 'GET';
  headers?: HeadersInit;
}

const TIMEOUT = 120 * 1000;

const skipModalRoutes = [API_ROUTES.getReviews, API_ROUTES.bookProduct];

export function useRequest() {
  const { openModal } = useModal();

  return async function createRequest<Response, Body = undefined>({
    endpoint,
    body,
    method = 'POST',
    headers = getDefaultHeaders(),
  }: RequestOptions<Body>): Promise<Response> {
    const controller = new AbortController();
    const timeoutResponse = Symbol('timeout');

    let timeoutId;

    const request = fetch(`${API_ROUTE_PREFIX}${endpoint}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
      signal: controller.signal,
    });

    const timeout = new Promise<typeof timeoutResponse>((resolve) => {
      timeoutId = setTimeout(resolve, TIMEOUT, timeoutResponse);
    });

    const response = await Promise.race<globalThis.Response | typeof timeoutResponse>([
      request,
      timeout,
    ]);

    if (response === timeoutResponse) {
      controller.abort();
      throw new Error(`Request to ${API_ROUTE_PREFIX}${endpoint} timed out`);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (!skipModalRoutes.includes(endpoint)) {
        openModal('somethingWentWrong');
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  };
}
