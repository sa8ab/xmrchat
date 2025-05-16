import {
  IsBoolean as IsBooleanBase,
  IsEmail as IsEmailBase,
  IsString as IsStringBase,
  Min as MinBase,
  Max as MaxBase,
  MinLength as MinLengthBase,
  MaxLength as MaxLengthBase,
  ValidationOptions,
} from 'class-validator';
import * as ValidatorJS from 'validator';
import { i18nValidationMessage } from 'nestjs-i18n';

// Helper to merge validation options with default message
const withDefaultMessage = <T extends ValidationOptions>(
  options?: T,
  message?: string | ((args: any) => string),
): T => ({
  ...options,
  message: options?.message || message,
});

export const IsEmail = (
  emailOptions?: ValidatorJS.IsEmailOptions,
  options?: ValidationOptions,
) =>
  IsEmailBase(emailOptions, withDefaultMessage(options, 'validation.isEmail'));

export const IsBoolean = (options?: ValidationOptions) =>
  IsBooleanBase(withDefaultMessage(options, 'validation.isBoolean'));

export const IsString = (options?: ValidationOptions) =>
  IsStringBase(withDefaultMessage(options, 'validation.isString'));

export const MaxLength = (max: number, options?: ValidationOptions) =>
  MaxLengthBase(max, withDefaultMessage(options, 'validation.maxLength'));

export const MinLength = (min: number, options?: ValidationOptions) =>
  MinLengthBase(min, withDefaultMessage(options, 'validation.minLength'));

export const Min = (min: number, options?: ValidationOptions) =>
  MinBase(
    min,
    withDefaultMessage(options, i18nValidationMessage('validation.min')),
  );

export const Max = (max: number, options?: ValidationOptions) =>
  MaxBase(
    max,
    withDefaultMessage(options, i18nValidationMessage('validation.max')),
  );
