import express from "express";

import { PrismaClient } from "@prisma/client";
import TripsValidator from "../../validators/TripsValidator.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

// create a trip
router.post("/", async (req, res) => {
  let trips;

  try {
    trips = TripsValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }
  const entry = await prisma.trips.create({
    data: {
      prompt: trips.prompt,
      output: trips.output,
      created_at: trips.created_at,
      updated_at: trips.updated_at,
    },
  });

  res.json(entry);
});

// get trips

router.get("/", async (req, res) => {
  const trips = await prisma.trips.findMany();
  res.json(trips);
});

// get snippet with his id
router.get("/:id", async (req, res) => {
  const trips = await prisma.trips.findUnique({
    where: {
      id: String(req.params.id),
    },
  });

  if (!trips) {
    return next(createError(404, "Trips not found"));
  }

  res.json(trips);
});

// update trips

router.patch("/:id", async (req, res) => {
  let trips;

  try {
    trips = TripsValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }
  const entry = await prisma.trips.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      prompt: trips.prompt,
      output: trips.output,
    },
  });

  res.json(entry);
});

export default router;
