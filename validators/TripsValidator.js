import { z } from "zod";

const TripsValidator = z.object({
  prompt: z.string(),
  output: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export default TripsValidator;
