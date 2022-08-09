import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headers: HeadersInit = {};

  if (req.headers.authorization !== undefined) {
    headers.authorization = req.headers.authorization;
  }

  const response = await fetch("https://api.cloudflare.com/client/v4/zones?per_page=50", { headers });
  const responseJson = await response.json();

  if (!response.ok) {
    return res.status(422).json({ detail: "CloudFlare responded with an error. Please double check your API token." });
  }

  const zones: Array<Zone> = responseJson.result.map((r: any) => ({ id: r.id, name: r.name }));

  return res.json(zones);
}
