import express from "express";
import { PrismaClient } from "@prisma/client";
import TripsValidator from "../../validators/TripsValidator.js";
import dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

const KEY_MISTRAL = process.env.KEY_MISTRAL;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL;
const MISTRAL_ANSWER = process.env.MISTRAL_ANSWER;
const PRE_PROMPT = process.env.PRE_PROMPT;

// enter a prompt
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const mistralAnswer = await fetch(MISTRAL_ANSWER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${KEY_MISTRAL}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: PRE_PROMPT + " " + prompt }],
      }),
    });

    const mistralData = await mistralAnswer.json();

    const trip = await prisma.trips.create({
      data: {
        prompt,
        output: JSON.parse(mistralData.choices[0].message.content),
      },
    });

    res.status(200).json(trip);
  } catch (error) {
    console.log(error);
    res.status(500).json({});
    // mettre un message d'erreur
  }
});

// get trips
router.get("/", async (req, res) => {
  // asc ou desc
  const sortOrderQuery = req.query.sortOrder;
  const sortByQuery = req.query.sortBy;

  // sorting
  let orderBy = [{ created_at: "desc" }];
  if (sortOrderQuery) {
    orderBy = [{ [sortByQuery]: sortOrderQuery }];
  }

  let take = 5;
  if (req.query.take) {
    take = parseInt(req.query.take);
  }

  const trips = await prisma.trips.findMany({ orderBy, take });

  res.json(trips);
});

// get trip with its id
router.get("/:id", async (req, res, next) => {
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
      updated_at: new Date(),
    },
  });

  res.json(entry);
});

export default router;
