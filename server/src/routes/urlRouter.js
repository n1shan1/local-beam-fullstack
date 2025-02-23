import { Router } from "express";
import { returnURL } from "../index.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ currentUrl: returnURL() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
