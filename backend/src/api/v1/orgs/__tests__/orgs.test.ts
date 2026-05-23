import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApp } from '../../../../app';
import { OrgService } from '../../../../services/OrgService';
import jwt from 'jsonwebtoken';

vi.mock('../../../../services/OrgService');
vi.mock('../../../../middleware/authenticate', () => ({
  authenticate: (req: any, res: any, next: any) => {
    // Mock authentication middleware
    req.user = { id: 'user-1', email: 'test@test.com' };
    next();
  },
}));

vi.mock('../../../../middleware/authorize', () => ({
  requireRole: () => (req: any, res: any, next: any) => {
    // Mock authorization to always pass for tests
    req.orgId = req.params.id || 'org-1';
    next();
  },
}));

const app = createApp();

describe('Orgs API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/v1/orgs', () => {
    it('should create an organization', async () => {
      const mockOrg = { id: 'org-1', name: 'Test Org', slug: 'test-org' };
      vi.mocked(OrgService.createOrg).mockResolvedValue(mockOrg as any);

      const res = await request(app)
        .post('/api/v1/orgs')
        .send({ name: 'Test Org', slug: 'test-org' })
        // Note: the real authenticate expects a Bearer token, but we mocked it.
        .set('Authorization', 'Bearer fake-token');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockOrg);
      expect(OrgService.createOrg).toHaveBeenCalledWith('user-1', { name: 'Test Org', slug: 'test-org' });
    });

    it('should return 400 validation error if slug is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/orgs')
        .send({ name: 'Test Org', slug: 'Invalid Slug!' })
        .set('Authorization', 'Bearer fake-token');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/orgs/:id', () => {
    it('should get an organization', async () => {
      const mockOrg = { id: 'org-1', name: 'Test Org' };
      vi.mocked(OrgService.getOrg).mockResolvedValue(mockOrg as any);

      const res = await request(app)
        .get('/api/v1/orgs/org-1')
        .set('Authorization', 'Bearer fake-token');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockOrg);
      expect(OrgService.getOrg).toHaveBeenCalledWith('org-1');
    });
  });
});
