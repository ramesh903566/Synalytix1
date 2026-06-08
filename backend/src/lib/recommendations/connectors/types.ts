export interface RawPlatformMetrics {
  [key: string]: unknown;
}

export interface PlatformConnector {
  readonly slug: string;
  readonly displayName: string;
  isConnected(userId: string): Promise<boolean>;
  fetchRawData(userId: string): Promise<RawPlatformMetrics>;
  computeScore(raw: RawPlatformMetrics): number;       // returns 0–100
  extractMetrics(raw: RawPlatformMetrics): RawPlatformMetrics;
}
