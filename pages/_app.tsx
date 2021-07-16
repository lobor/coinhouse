import "../styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
const ApolloProvider = dynamic(() => import('../components/Apollo'), { ssr: false })


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
