import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardService } from '../DashboardService';
import { prisma } from '../../db/client';
import { ActivityService } from '../ActivityService';

vi.mock('../ActivityService');

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a dashboard', async () => {
    const mockDash = { id: 'dash-1', name: 'Test Dash' };
    vi.mocked(prisma.dashboard.create).mockResolvedValue(mockDash as any);

    const result = await DashboardService.createDashboard('org-1', 'user-1', { project_id: 'proj-1', name: 'Test Dash' });
    expect(result).toEqual(mockDash);
    expect(ActivityService.log).toHaveBeenCalled();
  });

  it('should get a dashboard', async () => {
    const mockDash = { id: 'dash-1', name: 'Test Dash' };
    vi.mocked(prisma.dashboard.findFirst).mockResolvedValue(mockDash as any);

    const result = await DashboardService.getDashboard('org-1', 'dash-1');
    expect(result).toEqual(mockDash);
  });

  it('should update a dashboard', async () => {
    const mockDash = { id: 'dash-1', name: 'Test Dash' };
    vi.mocked(prisma.dashboard.findFirst).mockResolvedValue(mockDash as any);
    vi.mocked(prisma.dashboard.update).mockResolvedValue({ ...mockDash, name: 'Updated' } as any);

    const result = await DashboardService.updateDashboard('org-1', 'dash-1', 'user-1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should delete a dashboard', async () => {
    const mockDash = { id: 'dash-1', name: 'Test Dash' };
    vi.mocked(prisma.dashboard.findFirst).mockResolvedValue(mockDash as any);
    vi.mocked(prisma.dashboard.update).mockResolvedValue({ ...mockDash, deleted_at: new Date() } as any);

    const res = await DashboardService.deleteDashboard('org-1', 'dash-1', 'user-1');
    expect(res.success).toBe(true);
  });

  it('should share a dashboard', async () => {
    const mockDash = { id: 'dash-1', name: 'Test Dash' };
    vi.mocked(prisma.dashboard.findFirst).mockResolvedValue(mockDash as any);
    vi.mocked(prisma.dashboard.update).mockResolvedValue({ ...mockDash, is_public: true, share_token: '123' } as any);

    const res = await DashboardService.shareDashboard('org-1', 'dash-1', 'user-1');
    expect(res.shareToken).toBeDefined();
    expect(ActivityService.log).toHaveBeenCalled();
  });
});
