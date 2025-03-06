import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    
    return await bcrypt.hash(password, 10);
  } catch (error: unknown) {
    console.error('Failed to hash password:', error);
    throw new InternalServerErrorException('Failed to hash password');
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param plainTextPassword The plain text password
 * @param hashedPassword The hashed password to compare against
 * @returns True if the passwords match, false otherwise
 */
export async function comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error: unknown) {
    console.error('Failed to compare passwords:', error);
    throw new InternalServerErrorException('Failed to compare passwords');
  }
} 