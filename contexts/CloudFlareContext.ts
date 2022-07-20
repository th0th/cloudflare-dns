import { createContext } from 'react';

export type CloudFlareContextValue = {
  apiKey: string | null,
  set: <K extends Exclude<keyof CloudFlareContextValue, 'set'>>(k: K, v: CloudFlareContextValue[K]) => void,
};

export const CloudFlareContext = createContext<CloudFlareContextValue>({
  apiKey: null,
  set: () => null,
});
