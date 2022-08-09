import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SwrConfig } from "../components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SwrConfig>
      <Component {...pageProps} />
    </SwrConfig>
  );
}
