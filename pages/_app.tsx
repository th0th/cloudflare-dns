import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CloudFlareHandler } from '../components';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CloudFlareHandler>
      <Component {...pageProps} />
    </CloudFlareHandler>
  );
}
