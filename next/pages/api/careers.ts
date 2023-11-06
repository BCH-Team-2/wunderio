import { NextApiRequest, NextApiResponse } from "next";

import { drupal } from "@/lib/drupal/drupal-client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const languagePrefix = req.headers["accept-language"];
  const session = await getServerSession(req, res, authOptions);
  try {
    if (req.method === "POST") {
      const url = drupal.buildUrl(`/${languagePrefix}/webform_rest/submit`);
      const body = JSON.parse(req.body);

      const result = await drupal.fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify({
          webform_id: "careers_newsletter",
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (result.ok) {
        res.status(200).end();
      } else {
        res.status(result.status).end();
        throw new Error();
      }
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
}
