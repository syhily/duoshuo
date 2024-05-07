import { z } from 'zod';

// These types are used to enforce the checks that zod may not properly do.

export const int = z
  .string()
  .transform((s) => Number.parseInt(s, 10))
  .pipe(z.number().int());

export const boolean = z
  .string()
  .refine((s) => s === 'true' || s === 'false')
  .transform((s) => s === 'true');
