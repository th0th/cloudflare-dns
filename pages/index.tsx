import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

type State = {
  apiToken: string,
};

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<State>({ apiToken: "" });

  const handleApiKeyChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => setState((s) => ({
    ...s,
    apiToken: event.target.value,
  })), []);

  const handleFormSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    await router.push({ pathname: "/dns-records", query: { apiToken: state.apiToken } });
  }, [router, state.apiToken]);

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="input-api-key">CloudFlare API key</label>

      <input id="input-api-key" onChange={handleApiKeyChange} type="text" value={state.apiToken} />

      <button type="submit">Continue &rarr;</button>
    </form>
  );
}
