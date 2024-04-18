import express from "express";

import cors from "cors";

import V1Router from "./routes/v1.js";

const app = express();

const URL_FRONT = process.env.URL_FRONT;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [URL_FRONT],
    credentials: true,
  })
);

app.use("/v1", V1Router);

app.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
