import {
  IsBoolean as IsBooleanBase,
  Min as MinBase,
  ValidationOptions,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

// Helper to merge validation options with default message
const withDefaultMessage = <T extends ValidationOptions>(
  options?: T,
  message?: string | ((args: any) => string),
): T => ({
  ...options,
  message: options?.message || message,
});

export const IsBoolean = (options?: ValidationOptions) =>
  IsBooleanBase(withDefaultMessage(options, 'validation.isBoolean'));

// min
export const Min = (min: number, options?: ValidationOptions) =>
  MinBase(
    min,
    withDefaultMessage(options, i18nValidationMessage('validation.min')),
  );
