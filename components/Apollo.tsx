import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { persistCache, LocalStorageWrapper, PersistentStorage } from "apollo3-cache-persist";
import { PersistedData } from "apollo3-cache-persist/types";
import { FC } from "react";

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage) as PersistentStorage<PersistedData<any>>,
});
const client = new ApolloClient({
  cache,
});

const Apollo: FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Apollo;
