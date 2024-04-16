import express from "express";
import TripsRouter from "./v1/trips.js";

const router = express.Router();

router.use("/trips", TripsRouter);

export default router;
