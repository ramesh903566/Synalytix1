// Mock decryption since we don't have the real key setup
export function decryptToken(encrypted: string): string {
  return encrypted;
}
