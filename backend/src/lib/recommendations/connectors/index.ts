import type { PlatformConnector } from "./types";
import { githubConnector }   from "./github";
import { leetcodeConnector } from "./leetcode";
import { linkedinConnector } from "./linkedin";
import { xConnector }        from "./x";

export const ALL_CONNECTORS: PlatformConnector[] = [
  githubConnector,
  leetcodeConnector,
  linkedinConnector,
  xConnector,
];

export const CONNECTOR_MAP: Record<string, PlatformConnector> = Object.fromEntries(
  ALL_CONNECTORS.map((c) => [c.slug, c])
);
