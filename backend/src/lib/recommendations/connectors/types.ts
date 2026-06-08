/**
 * PlatformConnector interface
 * Each platform implements this to provide data to the recommendation engine.
 * Adding a new platform = creating a new file implementing this interface.
 */
export interface PlatformConnector {
  /** Unique platform slug matching the platform_connections.platform column */
  slug: string;
  /** Human-readable name */
  displayName: string;
  /** Compute a 0–100 score from raw platform data */
  computeScore(raw: Record<string, unknown>): number;
  /** Extract structured metrics from raw platform data */
  extractMetrics(raw: Record<string, unknown>): Record<string, unknown>;
  /** Check if user has this platform connected */
  isConnected(userId: string): Promise<boolean>;
  /** Fetch raw data from the platform APIs */
  fetchRawData(userId: string): Promise<Record<string, unknown>>;
}
