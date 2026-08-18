import express from "express";

import {
  fetchSettings,
  saveSettings
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", fetchSettings);

router.put("/", saveSettings);

export default router;