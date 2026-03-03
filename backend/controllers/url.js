import { nanoid } from "nanoid";
import URL from "../models/url.js";

export async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  console.log("Received request to generate short URL:", body);

  if (!body || !body.url)
    return res.status(400).json({ error: "URL is required" });

  // checking for existing short URL for the same redirect
  const existingURL = await URL.findOne({ redirectUrl: body.url });
  let shortId;

  if (!existingURL) {
    while (true) {
      shortId = nanoid(8);
      const existingShortId = await URL.findOne({ shortId });
      if (!existingShortId) break;
    }

    await URL.create({
      shortId: shortId,
      redirectUrl: body.url,
      visitHistory: [],
    });
  } else {
    shortId = existingURL.shortId;
  }

  return res.status(200).json({ id: shortId });
}
