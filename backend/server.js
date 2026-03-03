import express from "express";
import { connectDB } from "./utils/db.js";
import urlRoute from "./routes/url.js";
import URL from "./models/url.js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config();

await connectDB(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 8001;

const urlCreationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: "Too many short URLs created, please try again after 24 hours",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/url", urlCreationLimiter, urlRoute);

app.get("/health", (req, res) => {
  console.log("Health check endpoint hit");
  res.status(200).json({ status: "ok" });
});

app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const url = await URL.findOne({ shortId: shortId });

  if (!url) return res.status(404).json({ error: "URL not found" });

  url.visitHistory.push({
    timestamp: Date.now(),
  });
  await url.save();
  return res.redirect(url.redirectUrl);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
