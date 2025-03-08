import { ConflictException, InternalServerErrorException } from '@nestjs/common';

/**
 * Handles common error types in user operations
 * @param error The error to handle
 * @param defaultMessage The default message to use if the error is not a known type
 * @returns The appropriate exception to throw
 */
export function handleUserError(error: unknown, defaultMessage: string): Error {
  // Check if it's a NestJS exception that we want to return as is
  if (
    error instanceof ConflictException ||
    error instanceof InternalServerErrorException
  ) {
    return error;
  }
  
  // Otherwise, wrap it in a generic error
  return new InternalServerErrorException(defaultMessage);
} 