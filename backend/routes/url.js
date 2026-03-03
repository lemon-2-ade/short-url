import { Router } from "express";
import { handleGenerateNewShortURL } from "../controllers/url.js";
import URL from "../models/url.js";

const router = Router();

router.post("/", handleGenerateNewShortURL);

export default router;
