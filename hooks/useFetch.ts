import { useRouter } from "next/router";
import { useCallback } from "react";

export function useFetch() {
  const router = useRouter();

  return useCallback(async (input: RequestInfo | string, init?: RequestInit) => {
    const { apiToken } = router.query;

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...apiToken === undefined ? {} : { authorization: `bearer ${apiToken}` },
      ...init?.headers,
    };

    return fetch(input, { ...init, headers: { ...headers, ...init?.headers } });
  }, [router.query]);
}
