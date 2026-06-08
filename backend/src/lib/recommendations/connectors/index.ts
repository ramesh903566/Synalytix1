import { PlatformConnector } from './types';
import { githubConnector } from './github';
import { leetcodeConnector } from './leetcode';
import { linkedinConnector } from './linkedin';
import { xConnector } from './x';

/** Registry of all available platform connectors */
export const CONNECTORS: PlatformConnector[] = [
  githubConnector,
  leetcodeConnector,
  linkedinConnector,
  xConnector,
];

/** Look up a connector by its slug */
export function getConnector(slug: string): PlatformConnector | undefined {
  return CONNECTORS.find(c => c.slug === slug);
}

export type { PlatformConnector } from './types';
