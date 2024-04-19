import { it, describe } from "vitest";
import request from "supertest";
import { app } from "../app";

// je décris sur quel endpoint je tape
describe("GET v1/trips/3911a1f5-9bf3-473c-9991-9f6c246cdb5f", () => {
  // on décrit ensuite ce qu'on teste
  it("responds with the correct JSON data", () => {
    return request(app)
      .get("/v1/trips/3911a1f5-9bf3-473c-9991-9f6c246cdb5f")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200, {
        id: "3911a1f5-9bf3-473c-9991-9f6c246cdb5f",
        prompt: "Séjour en turique",
        updated_at: null,
        created_at: null,
        output: {
          itineraire: [
            {
              name: "Istanbul",
              location: {
                latitude: 41.0082,
                longitude: 28.9784,
              },
              description:
                "Visitez la Mosquée Bleue, Sainte-Sophie, le Palais de Topkapi et le Grand Bazar.",
            },
            {
              name: "Bursa",
              location: {
                latitude: 40.1833,
                longitude: 29.0667,
              },
              description:
                "Explorez le Mont Uludag et la Mosquée Verte, et profitez des sources thermales.",
            },
            {
              name: "Ephèse",
              location: {
                latitude: 37.9435,
                longitude: 27.3432,
              },
              description:
                "Découvrez le site archéologique d'Ephèse, la Maison de la Vierge Marie et le Temple d'Artémis.",
            },
            {
              name: "Pamukkale",
              location: {
                latitude: 37.9242,
                longitude: 29.1389,
              },
              description:
                "Visitez les terrasses blanches de Pamukkale et les ruines de Hiérapolis.",
            },
            {
              name: "Antalya",
              location: {
                latitude: 36.8913,
                longitude: 30.7016,
              },
              description:
                "Profitez des plages, du Vieux Port et de la Porte d'Hadrien.",
            },
            {
              name: "Cappadoce",
              location: {
                latitude: 38.6437,
                longitude: 34.8417,
              },
              description:
                "Découvrez les cheminées de fées, les villes souterraines et le Musée en plein air de Göreme.",
            },
          ],
        },
      });
  });
});
