export const getCookie = (key: string): string | undefined => {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require('next/headers');
    return cookies().get(key)?.value;
  } else {
    const allCookies = document.cookie.split('; ');
    const cookie = allCookies.find((cookie) => cookie.startsWith(`${key}=`));
    return cookie ? cookie.split('=')[1] : undefined;
  }
};
