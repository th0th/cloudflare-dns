import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";

type State = {
  apiToken: string,
};

export function PageIndex() {
  const router = useRouter();
  const [state, setState] = useState<State>({ apiToken: "" });

  const handleApiKeyChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => setState((s) => ({
    ...s,
    apiToken: event.target.value,
  })), []);

  const handleFormSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    await router.push({ pathname: "/zones", query: { apiToken: state.apiToken } });
  }, [router, state.apiToken]);

  return (
    <div className="container d-flex flex-column justify-content-center min-vh-100 py-4" style={{ maxWidth: 480 }}>
      <Form onSubmit={handleFormSubmit}>
        <p>
          {"Please paste your CloudFlare API token to continue. If you don't have one, you can create "}
          <a href="https://dash.cloudflare.com/profile/api-tokens" rel="noreferrer" target="_blank">here</a>
          .
        </p>

        <FormGroup className="mb-3" controlId="form-group-cloudflare-api-token">
          <Form.Label>CloudFlare API key</Form.Label>

          <Form.Control onChange={handleApiKeyChange} required type="text" value={state.apiToken} />

          <Form.Text className="text-muted">
            Your API token is not stored. It is used only during your session.
          </Form.Text>
        </FormGroup>

        <div className="d-grid">
          <Button className="btn btn-primary" type="submit">Continue &rarr;</Button>
        </div>
      </Form>
    </div>
  );
}
