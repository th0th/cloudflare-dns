import type { NextApiRequest, NextApiResponse } from "next";
import { respond405, respondDetail } from "../../../../../apiHelpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { zoneId } = req.query;

  const headers: HeadersInit = {};

  if (req.headers.authorization !== undefined) {
    headers.authorization = req.headers.authorization;
  }

  if (req.method === "DELETE") {
    const { dnsRecordIds } = req.body;

    if (dnsRecordIds === undefined || !Array.isArray(dnsRecordIds) || dnsRecordIds.find((i) => typeof i !== "string") !== undefined) {
      return res.status(422).json({ dnsRecordIds: "Please provide the list of DNS record ids as an array of string." });
    }

    const promises: Array<Promise<void>> = [];

    (dnsRecordIds as Array<string>).forEach((dnsRecordId) => {
      promises.push(new Promise((resolve, reject) => {
        fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${dnsRecordId}`, { headers, method: "DELETE" })
          .then((response) => (response.status === 200 ? resolve() : reject()))
          .catch(() => reject());
      }));
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      return respondDetail(res, 400, "Some of the DNS records couldn't be deleted.");
    }

    return res.status(204).send(null);
  }

  if (req.method === "GET") {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=5000`, { headers });
    const responseJson = await response.json();

    if (response.status === 403) {
      return res.status(403).json({ detail: "Authentication failed." });
    }

    const dnsRecords: Array<DnsRecord> = [];

    responseJson.result.forEach((r: any) => dnsRecords.push({ content: r.content, id: r.id, name: r.name, type: r.type }));

    return res.json(dnsRecords);
  }

  return respond405(res);
}
