import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashes the provided answer string using bcrypt.
 * @param {string} answer - The plaintext answer.
 * @returns {Promise<string>} - The hashed answer.
 */
export async function hashAnswer(answer) {
  if (typeof answer !== 'string') {
    throw new Error('Answer must be a string');
  }
  return bcrypt.hash(answer.trim().toLowerCase(), SALT_ROUNDS);
}

/**
 * Verifies a plaintext answer against a stored bcrypt hash.
 * @param {string} answer - The plaintext answer.
 * @param {string} hash - The bcrypt hash to compare against.
 * @returns {Promise<boolean>} - True if the answer matches the hash.
 */
export async function verifyAnswer(answer, hash) {
  if (typeof answer !== 'string' || typeof hash !== 'string') {
    throw new Error('Invalid arguments');
  }
  return bcrypt.compare(answer.trim().toLowerCase(), hash);
}