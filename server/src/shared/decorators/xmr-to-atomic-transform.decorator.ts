import { Transform, TransformOptions } from 'class-transformer';
import { MoneroUtils } from 'monero-ts';

export const XmrToAtomicTransform = (options?: TransformOptions) => {
  return Transform(({ value }) => {
    if (value === null || value === '') return null;
    return MoneroUtils.xmrToAtomicUnits(value).toString();
  }, options);
};
