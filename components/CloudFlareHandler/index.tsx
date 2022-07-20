import { CloudFlareContext, CloudFlareContextValue } from '../../contexts';
import React, { useCallback, useState } from 'react';

type CloudFlareHandlerProps = {
  children: React.ReactNode,
};

export function CloudFlareHandler({ children }: CloudFlareHandlerProps) {
  const [state, setState] = useState<Omit<CloudFlareContextValue, 'set'>>({
    apiKey: null,
  });

  const set = useCallback<CloudFlareContextValue['set']>((k, v) => setState((s) => ({ ...s, [k]: v })), []);

  return (
    <CloudFlareContext.Provider value={{ ...state, set }}>
      {children}
    </CloudFlareContext.Provider>
  );
}
