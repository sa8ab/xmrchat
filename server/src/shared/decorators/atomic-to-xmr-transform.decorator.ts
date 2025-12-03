import { Transform, TransformOptions } from 'class-transformer';
import { MoneroUtils } from 'monero-ts';

export const AtomicToXmrTransform = (options?: TransformOptions) => {
  return Transform(({ value }) => {
    if (value === null || value === '') return null;
    return MoneroUtils.atomicUnitsToXmr(value);
  }, options);
};
