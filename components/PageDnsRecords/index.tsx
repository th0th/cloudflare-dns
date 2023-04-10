import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormGroup } from "react-bootstrap";
import { useFetch } from "../../hooks";

type State = {
  dnsRecordIdsToDelete: Array<string>,
  dnsRecords: Array<DnsRecord> | null,
  errorMessage: string | null,
  filter: string,
  isInProgress: boolean,
};

export function PageDnsRecords() {
  const router = useRouter();
  const fetch = useFetch();
  const [state, setState] = useState<State>({
    dnsRecordIdsToDelete: [],
    dnsRecords: null,
    errorMessage: null,
    filter: "",
    isInProgress: false,
  });

  const listDnsRecords = useCallback(async () => {
    const response = await fetch(`/api/zones/${router.query.zoneId}/dns-records`);
    const responseJson = await response.json();

    if (response.ok) {
      setState((s) => ({ ...s, dnsRecords: responseJson }));
    } else {
      setState((s) => ({ ...s, errorMessage: responseJson.detail }));
    }
  }, [fetch, router.query.zoneId]);

  const deleteDnsRecords = useCallback(async () => {
    setState((s) => ({ ...s, isInProgress: true }));

    const response = await fetch(`/api/zones/${router.query.zoneId}/dns-records/`, {
      body: JSON.stringify({ dnsRecordIds: state.dnsRecordIdsToDelete }),
      method: "DELETE",
    });

    if (response.ok) {
      await listDnsRecords();

      setState((s) => ({ ...s, dnsRecordIdsToDelete: [], filter: "", isInProgress: false }));
    }
  }, [fetch, listDnsRecords, router.query.zoneId, state.dnsRecordIdsToDelete]);

  const handleDnsRecordCheckboxChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => setState((s) => {
    let dnsRecordIdsToDelete: Array<string> = [...s.dnsRecordIdsToDelete];

    if (event.target.checked) {
      dnsRecordIdsToDelete = Array.from(new Set([...dnsRecordIdsToDelete, event.target.id]));
    } else {
      dnsRecordIdsToDelete = dnsRecordIdsToDelete.filter((i) => i !== event.target.id);
    }

    return { ...s, dnsRecordIdsToDelete };
  }), []);

  const handleFilterChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => setState((s) => ({
    ...s,
    filter: event.target.value,
  })), []);

  const filteredDnsRecords = useMemo<Array<DnsRecord> | null>(() => {
    if (state.dnsRecords === null) {
      return null;
    }

    return state.dnsRecords.filter(
      (r) => state.dnsRecordIdsToDelete.includes(r.id) || `${r.content}|${r.name}|${r.type}`.includes(state.filter),
    );
  }, [state.dnsRecordIdsToDelete, state.dnsRecords, state.filter]);

  const handleSelectAllButtonClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
    if (filteredDnsRecords === null) {
      return;
    }

    const filteredDnsRecordIds = filteredDnsRecords?.map((r) => r.id);

    setState((s) => ({
      ...s,
      dnsRecordIdsToDelete: Array.from(new Set([...s.dnsRecordIdsToDelete, ...filteredDnsRecordIds])),
    }));
  }, [filteredDnsRecords]);

  const handleClearSelectionButtonClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
    setState((s) => ({ ...s, dnsRecordIdsToDelete: [] }));
  }, []);

  const contentNode = useMemo<React.ReactNode>(() => {
    if (state.errorMessage !== null) {
      return (
        <div className="container d-flex flex-column justify-content-center min-vh-100 py-4" style={{ maxWidth: 480 }}>
          <p>{state.errorMessage}</p>

          <div className="d-grid">
            <Link href="/">
              <a className="btn btn-primary">&larr; Go back</a>
            </Link>
          </div>
        </div>
      );
    }

    if (filteredDnsRecords === null) {
      return (
        <div className="align-items-center container d-flex flex-column justify-content-center min-vh-100 py-4">
          <div className="spinner-border" />
        </div>
      );
    }

    return (
      <div className="container d-flex flex-column pb-4" style={{ maxWidth: 720 }}>
        <Form>
          <fieldset disabled={state.isInProgress}>
            <div className="bg-white py-4 sticky-top">
              <p className="text-center">Please select the DNS records you want to delete.</p>

              <div className="my-2 text-center">
                <button
                  className="btn btn-danger"
                  disabled={state.dnsRecordIdsToDelete.length === 0}
                  onClick={deleteDnsRecords}
                  type="button"
                >
                  {state.dnsRecordIdsToDelete.length === 0 ? "Delete" : `Delete ${state.dnsRecordIdsToDelete.length} records`}
                </button>
              </div>

              <FormGroup controlId="form-group-filter">
                <Form.Label>Filter</Form.Label>

                <Form.Control
                  id="filter-input"
                  onChange={handleFilterChange}
                  size="sm"
                  type="text"
                  value={state.filter}
                />
              </FormGroup>

              <div className="d-grid gap-2 mt-4 sticky-top">
                <button className="btn btn-primary btn-sm" onClick={handleSelectAllButtonClick} type="button">
                  Select all
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  disabled={state.dnsRecordIdsToDelete.length === 0}
                  onClick={handleClearSelectionButtonClick}
                  type="button"
                >
                  Clear selection
                </button>
              </div>
            </div>

            {state.isInProgress ? (
              <div className="align-items-center d-flex flex-column flex-grow-1 justify-content-center">
                <div className="spinner-border" />
              </div>
            ) : (
              <div>
                <div className="list-group">
                  {filteredDnsRecords.map((r) => (
                    <label className="list-group-item list-group-item-action" key={r.id}>
                      <div className="d-flex flex-column flex-grow-1">
                        <div className="align-items-center d-flex">
                          <input
                            checked={state.dnsRecordIdsToDelete.includes(r.id)}
                            className="flex-shrink-0 form-check-input me-1"
                            id={r.id}
                            onChange={handleDnsRecordCheckboxChange}
                            type="checkbox"
                          />

                          <div className="d-flex flex-grow-1 flex-shrink-1 overflow-hidden">
                            <div className="fw-bold ps-1 text-nowrap text-truncate" title={r.name}>
                              {r.name}
                            </div>

                            <div className="ms-auto flex-grow-0 flex-shrink-0">
                              <span className="badge bg-primary rounded-pill">{r.type}</span>
                            </div>
                          </div>
                        </div>

                        <small className="mt-1 text-truncate" title={r.content}>
                          {r.content}
                        </small>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </fieldset>
        </Form>
      </div>
    );
  }, [
    deleteDnsRecords,
    filteredDnsRecords,
    handleClearSelectionButtonClick,
    handleDnsRecordCheckboxChange,
    handleFilterChange,
    handleSelectAllButtonClick,
    state.dnsRecordIdsToDelete,
    state.errorMessage,
    state.filter,
    state.isInProgress,
  ]);

  useEffect(() => {
    if (router.isReady) {
      listDnsRecords();
    }
  }, [listDnsRecords, router.isReady]);

  return contentNode;
}
