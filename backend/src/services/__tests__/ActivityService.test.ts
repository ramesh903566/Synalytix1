import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActivityService } from '../ActivityService';
import { prisma } from '../../db/client';

describe('ActivityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an activity log without throwing', async () => {
    vi.mocked(prisma.activityLog.create).mockResolvedValue({ id: 'log-1' } as any);

    await ActivityService.log({
      organizationId: 'org-1',
      userId: 'user-1',
      action: 'TEST_ACTION',
      entityType: 'test',
      entityId: 'test-1',
    });

    expect(prisma.activityLog.create).toHaveBeenCalledWith({
      data: {
        organization_id: 'org-1',
        user_id: 'user-1',
        action: 'TEST_ACTION',
        entity_type: 'test',
        entity_id: 'test-1',
        metadata: undefined,
        ip_address: undefined,
      },
    });
  });

  it('should safely swallow errors during log creation', async () => {
    vi.mocked(prisma.activityLog.create).mockRejectedValue(new Error('DB Error'));

    // Should not throw
    await expect(ActivityService.log({
      organizationId: 'org-1',
      action: 'TEST_ACTION',
      entityType: 'test',
    })).resolves.toBeUndefined();
  });

  it('should list activity logs', async () => {
    const mockLogs = [{ id: 'log-1' }, { id: 'log-2' }];
    vi.mocked(prisma.activityLog.findMany).mockResolvedValue(mockLogs as any);

    const result = await ActivityService.getLogs('org-1', 1);

    // Since mockLogs length > limit, it returns nextCursor
    expect(result.logs.length).toBe(1);
    expect(result.nextCursor).toBe('log-2');
    expect(prisma.activityLog.findMany).toHaveBeenCalled();
  });
});
