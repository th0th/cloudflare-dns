import { NextApiResponse } from "next";

export function respondDetail(res: NextApiResponse, status: number, detail: string) {
  return res.status(status).json({ detail });
}

export function respond404(res: NextApiResponse) {
  return respondDetail(res, 404, "Not found.");
}

export function respond405(res: NextApiResponse) {
  return respondDetail(res, 405, "Method not allowed.");
}
