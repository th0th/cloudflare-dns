import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { SWRConfig } from "swr";
import { SwrError } from "../../lib";

type Props = {
  children: React.ReactNode,
};

export function SwrConfig({ children }: Props) {
  const router = useRouter();

  const fetcher = useCallback(async (input: RequestInfo | string, init?: RequestInit) => {
    let response: Response;

    const { apiToken } = router.query;

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...apiToken === undefined ? {} : { authorization: `bearer ${apiToken}` },
      ...init?.headers,
    };

    try {
      response = await fetch(input, { ...init, headers });
    } catch (e) {
      throw new SwrError("An error occurred while fetching the data.");
    }

    if (!response.ok) {
      const responseJson = await response.json();
      throw new SwrError("An error occurred while fetching the data.", response.status, responseJson);
    }

    return response.json();
  }, [router.query]);

  return (
    <SWRConfig value={{ fetcher }}>
      {children}
    </SWRConfig>
  );
}
