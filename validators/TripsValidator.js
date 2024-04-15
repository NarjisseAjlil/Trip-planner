import { z } from "zod";

const TripsValidator = z.object({
  prompt: z.string(),
  output: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export default TripsValidator;
