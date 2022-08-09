import type { NextApiRequest, NextApiResponse } from "next";
import { respond405 } from "../../../../../apiHelpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return respond405(res);
  }

  const { dnsRecordId, zoneId } = req.query;

  const headers: HeadersInit = {};

  if (req.headers.authorization !== undefined) {
    headers.authorization = req.headers.authorization;
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=5000`, { headers });
  const responseJson = await response.json();

  if (response.status === 403) {
    return res.status(403).json({ detail: "Authentication failed." });
  }

  const dnsRecords: Array<DnsRecord> = [];

  responseJson.result.forEach((r: any) => {
    dnsRecords.push({ content: r.content, id: r.id, name: r.name, type: r.type });
  });

  return res.json(dnsRecords);
}
