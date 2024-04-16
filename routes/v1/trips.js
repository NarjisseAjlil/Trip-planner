import express from "express";
import { PrismaClient } from "@prisma/client";
import TripsValidator from "../../validators/TripsValidator.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

const API_MISTRAL = process.env.API_MISTRAL;
// pre prompt
const prePrompt =
  "Tu es un planificateur de voyage, expert en tourisme. Pour la destination, le nombre de jours et le moyen de locomotion que je te donnerai à la fin du message, programme moi un itinéraire en plusieurs étapes Format de données souhaité: un JSON Avec, pour chaque étape: - le nom du lieu (clef JSON: name) -sa position géographique (clef JSON: location-> avec latitude/longitude en numérique) - une courte description (clef JSON: description) Donne-moi juste cette liste d'étape, sans texte autour.";

// enter a prompt
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const mistralAnswer = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${API_MISTRAL}`,
        },
        body: JSON.stringify({
          model: "open-mixtral-8x7b",
          messages: [{ role: "user", content: prePrompt + " " + prompt }],
        }),
      }
    );

    const mistralData = await mistralAnswer.json();

    const trip = await prisma.trips.create({
      data: {
        prompt,
        output: JSON.stringify(mistralData.choices[0].message.content),
      },
    });

    res.status(200).json(trip);
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
});

// get trips
router.get("/", async (req, res) => {
  const trips = await prisma.trips.findMany();
  res.json(trips);
});

// get trip with its id
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
