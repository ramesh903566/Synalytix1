import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrgService } from '../OrgService';
import { prisma } from '../../db/client';
import { ConflictError, NotFoundError } from '../../lib/errors';
import { ActivityService } from '../ActivityService';

vi.mock('../../db/client', () => ({
  prisma: {
    organization: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma)),
  },
}));

vi.mock('../ActivityService', () => ({
  ActivityService: {
    log: vi.fn(),
  },
}));

describe('OrgService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrg', () => {
    it('should throw ConflictError if slug is taken', async () => {
      vi.mocked(prisma.organization.findUnique).mockResolvedValue({ id: 'existing-id' } as any);

      await expect(OrgService.createOrg('user-1', { name: 'Test', slug: 'test' })).rejects.toThrow(ConflictError);
    });

    it('should create an organization and log activity', async () => {
      vi.mocked(prisma.organization.findUnique).mockResolvedValue(null);
      const mockOrg = { id: 'org-1', name: 'Test', slug: 'test' };
      vi.mocked(prisma.organization.create).mockResolvedValue(mockOrg as any);

      const org = await OrgService.createOrg('user-1', { name: 'Test', slug: 'test' });

      expect(org).toEqual(mockOrg);
      expect(prisma.organization.create).toHaveBeenCalled();
      expect(ActivityService.log).toHaveBeenCalledWith({
        organizationId: 'org-1',
        userId: 'user-1',
        action: 'CREATE_ORG',
        entityType: 'organization',
        entityId: 'org-1',
      });
    });
  });

  describe('getOrg', () => {
    it('should throw NotFoundError if org is missing or deleted', async () => {
      vi.mocked(prisma.organization.findUnique).mockResolvedValue(null);

      await expect(OrgService.getOrg('missing-id')).rejects.toThrow(NotFoundError);
    });

    it('should return the org if it exists', async () => {
      const mockOrg = { id: 'org-1', name: 'Test' };
      vi.mocked(prisma.organization.findUnique).mockResolvedValue(mockOrg as any);

      const org = await OrgService.getOrg('org-1');
      expect(org).toEqual(mockOrg);
    });
  });
});
