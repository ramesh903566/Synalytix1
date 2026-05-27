import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

// ─── Supabase Client ──────────────────────────────────────────────────────────
// We use the SERVICE ROLE KEY here (backend only — never expose to frontend)
// This bypasses Row Level Security and lets us read/write any row.

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ─── Token Encryption ─────────────────────────────────────────────────────────
// Access tokens are sensitive. We encrypt them before storing in the DB.
// Even if someone gets DB access, they can't use raw tokens.

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET!;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_SECRET || ENCRYPTION_SECRET.length < 32) {
  throw new Error('ENCRYPTION_SECRET must be at least 32 characters in .env');
}

// Derive a 32-byte key from our secret
const ENCRYPTION_KEY = crypto.scryptSync(ENCRYPTION_SECRET, 'synalytix-salt', 32);

/**
 * Encrypts a plain text string (e.g., an access token)
 * Returns: "iv:authTag:encryptedData" as a single string for DB storage
 */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Store everything needed to decrypt as one string
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a previously encrypted string back to plaintext
 */
export function decrypt(encryptedString: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedString.split(':');

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted token format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ─── PKCE Helpers (needed for X OAuth 2.0) ───────────────────────────────────

/**
 * Generates a random code verifier for PKCE
 */
export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generates code challenge from verifier (S256 method)
 */
export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

/**
 * Generates a random state token for CSRF protection
 */
export function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}
