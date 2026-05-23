import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '../ProjectService';
import { prisma } from '../../db/client';
import { NotFoundError } from '../../lib/errors';
import { ActivityService } from '../ActivityService';

vi.mock('../ActivityService');

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a project', async () => {
    const mockProj = { id: 'proj-1', name: 'Test Proj' };
    vi.mocked(prisma.project.create).mockResolvedValue(mockProj as any);

    const result = await ProjectService.createProject('org-1', 'user-1', { name: 'Test Proj' });
    expect(result).toEqual(mockProj);
    expect(ActivityService.log).toHaveBeenCalled();
  });

  it('should get a project', async () => {
    const mockProj = { id: 'proj-1', name: 'Test Proj' };
    vi.mocked(prisma.project.findFirst).mockResolvedValue(mockProj as any);

    const result = await ProjectService.getProject('org-1', 'proj-1');
    expect(result).toEqual(mockProj);
  });

  it('should list projects', async () => {
    const mockProjs = [{ id: 'proj-1' }];
    vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjs as any);

    const result = await ProjectService.listProjects('org-1', 10);
    expect(result.projects).toEqual(mockProjs);
  });

  it('should update a project', async () => {
    const mockProj = { id: 'proj-1', name: 'Test Proj' };
    vi.mocked(prisma.project.findFirst).mockResolvedValue(mockProj as any);
    vi.mocked(prisma.project.update).mockResolvedValue({ ...mockProj, name: 'Updated' } as any);

    const result = await ProjectService.updateProject('org-1', 'proj-1', 'user-1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
    expect(ActivityService.log).toHaveBeenCalled();
  });

  it('should delete a project', async () => {
    const mockProj = { id: 'proj-1', name: 'Test Proj' };
    vi.mocked(prisma.project.findFirst).mockResolvedValue(mockProj as any);
    vi.mocked(prisma.project.update).mockResolvedValue({ ...mockProj, deleted_at: new Date() } as any);

    const res = await ProjectService.deleteProject('org-1', 'proj-1', 'user-1');
    expect(res.success).toBe(true);
    expect(ActivityService.log).toHaveBeenCalled();
  });
});
