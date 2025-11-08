/**
 * Node.js script to generate a secure NEXTAUTH_SECRET.
 *
 * This command generates 32 cryptographically secure random bytes
 * and encodes them using Base64, which is the recommended format
 * for the NextAuth secret.
 *
 * To run:
 * 1. Ensure Node.js is installed.
 * 2. Save this file as 'generate-secret.js'.
 * 3. Run in your terminal: node generate-secret.js
 */
import { webcrypto } from 'crypto'; // Use webcrypto for a more modern, importable approach

// Generate 32 random bytes (256 bits) and encode them as a Base64 string
// Use webcrypto.getRandomValues and convert the array to a Base64 string compatible with NextAuth.
const randomBytes = webcrypto.getRandomValues(new Uint8Array(32));
const secret = Buffer.from(randomBytes).toString('base64');

console.log('\n--- Generated NEXTAUTH_SECRET ---');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('-----------------------------------');
console.log('\nCopy the line above and paste it into your .env file.');