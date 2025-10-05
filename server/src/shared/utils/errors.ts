import axios, { AxiosError, AxiosResponse, isAxiosError } from 'axios';

/**
 * Extracts a readable message from many shapes Axios returns:
 * - AxiosError (with response.data as object/string/array)
 *
 * Returns `fallback` if no useful message found.
 */
export function getAxiosMessage(
  input: unknown,
  fallback = 'Something went wrong',
): string {
  const extractFromData = (data: any): string | null => {
    if (data == null) return null;
    if (typeof data === 'string') return data;
    if (typeof data === 'number' || typeof data === 'boolean')
      return String(data);

    if (Array.isArray(data)) {
      if (data.every((x) => typeof x === 'string')) return data.join('; ');
      return data
        .map((x) =>
          typeof x === 'string' ? x : (x?.message ?? JSON.stringify(x)),
        )
        .join('; ');
    }

    // common keys APIs use
    const keys = [
      'message',
      'msg',
      'error',
      'detail',
      'description',
      'title',
      'reason',
      'statusText',
    ];
    for (const k of keys) {
      const v = data[k];
      if (v != null) {
        if (Array.isArray(v))
          return v
            .map((x) =>
              typeof x === 'string' ? x : (x?.message ?? JSON.stringify(x)),
            )
            .join('; ');
        return typeof v === 'string' ? v : String(v);
      }
    }

    // handle nested "errors" (object or array) often returned by validation endpoints
    if (data.errors) {
      const errs = data.errors;
      if (typeof errs === 'string') return errs;
      if (Array.isArray(errs))
        return errs
          .map((e) =>
            typeof e === 'string' ? e : (e?.message ?? JSON.stringify(e)),
          )
          .join('; ');
      if (typeof errs === 'object') {
        // flatten object values: { field: ['a','b'], other: ['c'] }
        const vals = Object.values(errs).flatMap((v) =>
          Array.isArray(v) ? v : [v],
        );
        return vals
          .map((v) =>
            typeof v === 'string' ? v : (v?.message ?? JSON.stringify(v)),
          )
          .join('; ');
      }
    }

    // fallback to a short JSON summary if nothing else
    try {
      const s = JSON.stringify(data);
      return s.length <= 200 ? s : s.slice(0, 200) + '...';
    } catch {
      return null;
    }
  };

  if (!isAxiosError(input)) return fallback;

  const err = input as AxiosError;
  const resp = err.response;
  if (resp) {
    return (
      extractFromData(resp.data) ??
      resp.statusText ??
      (resp.status && `Request failed with status ${resp.status}`) ??
      err.message ??
      fallback
    );
  }
  // no response -> network / timeout etc
  return err.message ?? fallback;
}

/**
 * Generic error message extractor that works with different types of errors.
 * Uses getAxiosMessage for axios errors, and handles other error types.
 *
 * @param error - Any error object
 * @param fallback - Fallback message if no useful message found
 * @returns A readable error message
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  // Handle axios errors using the specialized function
  if (isAxiosError(error)) {
    return getAxiosMessage(error, fallback);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || fallback;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as any).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  // Handle objects with error property
  if (error && typeof error === 'object' && 'error' in error) {
    const errorValue = (error as any).error;
    if (typeof errorValue === 'string' && errorValue.trim()) {
      return errorValue;
    }
  }

  // Handle objects with detail property
  if (error && typeof error === 'object' && 'detail' in error) {
    const detail = (error as any).detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }
  }

  // Try to stringify the error if it's an object
  if (error && typeof error === 'object') {
    try {
      const stringified = JSON.stringify(error);
      if (stringified && stringified !== '{}' && stringified !== 'null') {
        return stringified.length <= 200
          ? stringified
          : stringified.slice(0, 200) + '...';
      }
    } catch {
      // JSON.stringify failed, continue to fallback
    }
  }

  // Handle primitive types
  if (error !== null && error !== undefined) {
    const stringified = String(error);
    if (stringified && stringified !== 'null' && stringified !== 'undefined') {
      return stringified;
    }
  }

  return fallback;
}
