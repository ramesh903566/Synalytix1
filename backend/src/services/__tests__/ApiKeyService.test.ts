import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiKeyService } from '../ApiKeyService';
import { prisma } from '../../db/client';
import { ActivityService } from '../ActivityService';
import { NotFoundError } from '../../lib/errors';

vi.mock('../ActivityService');

describe('ApiKeyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an API key', async () => {
    const mockKey = { id: 'key-1', prefix: 'syn_live_123', name: 'Test Key' };
    vi.mocked(prisma.apiKey.create).mockResolvedValue(mockKey as any);

    const result = await ApiKeyService.createKey('org-1', 'user-1', { name: 'Test Key' });

    expect(result.id).toBe('key-1');
    expect(result.key).toMatch(/^syn_live_/);
    expect(ActivityService.log).toHaveBeenCalled();
  });

  it('should list API keys', async () => {
    const mockKeys = [{ id: 'key-1' }];
    vi.mocked(prisma.apiKey.findMany).mockResolvedValue(mockKeys as any);

    const keys = await ApiKeyService.listKeys('org-1');
    expect(keys).toEqual(mockKeys);
  });

  it('should update an API key', async () => {
    const mockKey = { id: 'key-1', name: 'Test Key' };
    vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(mockKey as any);
    vi.mocked(prisma.apiKey.update).mockResolvedValue({ ...mockKey, name: 'Updated Key' } as any);

    const updated = await ApiKeyService.updateKey('org-1', 'key-1', 'user-1', { name: 'Updated Key' });
    expect(updated.name).toBe('Updated Key');
    expect(ActivityService.log).toHaveBeenCalled();
  });

  it('should delete an API key', async () => {
    const mockKey = { id: 'key-1', name: 'Test Key' };
    vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(mockKey as any);
    vi.mocked(prisma.apiKey.update).mockResolvedValue({ ...mockKey, deleted_at: new Date() } as any);

    const res = await ApiKeyService.deleteKey('org-1', 'key-1', 'user-1');
    expect(res.success).toBe(true);
    expect(ActivityService.log).toHaveBeenCalled();
  });

  it('should throw NotFoundError if updating a non-existent key', async () => {
    vi.mocked(prisma.apiKey.findFirst).mockResolvedValue(null);

    await expect(ApiKeyService.updateKey('org-1', 'missing', 'user-1', {})).rejects.toThrow(NotFoundError);
  });
});
