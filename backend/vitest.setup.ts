import { vi } from 'vitest';

process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';
process.env.DIRECT_URL = 'postgres://user:pass@localhost:5432/db';

vi.mock('express-rate-limit', () => ({
  default: () => (req: any, res: any, next: any) => next()
}));

vi.mock('rate-limit-redis', () => ({
  RedisStore: class {
    constructor() {}
  }
}));

vi.mock('./src/lib/redis', () => ({
  redis: {
    call: vi.fn().mockResolvedValue([]),
    on: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  }
}));

vi.mock('./src/jobs/queues/datasetQueue', () => ({
  datasetQueue: {
    add: vi.fn(),
  }
}));

vi.mock('./src/db/client', () => {
  return {
    prisma: {
      organization: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      activityLog: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
      apiKey: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      project: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      dashboard: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb({ organization: { create: vi.fn() } })),
    }
  };
});
