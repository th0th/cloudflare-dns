import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useFetch } from "../../hooks";

type State = {
  errorMessage: string | null;
  zones: Array<Zone> | null;
};

export function PageZones() {
  const router = useRouter();
  const fetch = useFetch();
  const [state, setState] = useState<State>({ errorMessage: null, zones: null });

  const contentNode = useMemo<React.ReactNode>(() => {
    if (state.errorMessage !== null) {
      return (
        <div>
          <p>{state.errorMessage}</p>

          <div className="d-grid">
            <Link href="/">
              <a className="btn btn-primary">&larr; Go back</a>
            </Link>
          </div>
        </div>
      );
    }

    if (state.zones === null) {
      return (
        <div className="align-items-center d-flex flex-column">
          <div className="spinner-border" />
        </div>
      );
    }

    return (
      <div>
        <p>Please select a zone to continue.</p>

        <div className="list-group">
          {state.zones.map((z) => (
            <Link href={{ pathname: "dns-records", query: { ...router.query, zoneId: z.id } }} key={z.id}>
              <a className="list-group-item list-group-item-action">{z.name}</a>
            </Link>
          ))}
        </div>
      </div>
    );
  }, [router.query, state.errorMessage, state.zones]);

  useEffect(() => {
    async function listZones() {
      const response = await fetch("/api/zones");
      const responseJson = await response.json();

      if (response.ok) {
        setState((s) => ({ ...s, zones: responseJson }));
      } else {
        setState((s) => ({ ...s, errorMessage: responseJson.detail }));
      }
    }

    if (router.isReady) {
      listZones();
    }
  }, [fetch, router.isReady]);

  return (
    <div className="container d-flex flex-column justify-content-center min-vh-100 py-4" style={{ maxWidth: 480 }}>
      {contentNode}
    </div>
  );
}
