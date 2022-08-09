import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headers: HeadersInit = {};

  if (req.headers.authorization !== undefined) {
    headers.authorization = req.headers.authorization;
  }

  const response = await fetch("https://api.cloudflare.com/client/v4/zones?per_page=50", { headers });
  const responseJson = await response.json();

  if (response.status === 403) {
    return res.status(403).json({ detail: "Authentication failed." });
  }

  const zones: Array<Zone> = responseJson.result.map((r: any) => ({ id: r.id, name: r.name }));

  return res.json(zones);
}
