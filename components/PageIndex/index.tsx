import React, { useCallback, useContext } from 'react';
import { CloudFlareContext } from '../../contexts';

export function PageIndex() {
  const { apiKey, set } = useContext(CloudFlareContext);

  const handleApiKeyChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    set<'apiKey'>('apiKey', event.target.value);
  }, [set]);

  return (
    <form>
      <label>CloudFlare API key</label>

      <input type="text" onChange={handleApiKeyChange} value={apiKey || ''} />

      <button type="submit">
        Continue &rarr;
      </button>
    </form>
  );
}
