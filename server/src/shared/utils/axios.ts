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
