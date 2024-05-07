import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { int } from '@/utils/env/types';

export const env = createEnv({
  server: {
    PORT: int,
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  runtimeEnv: process.env,
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: true,
  skipValidation: true,
});
