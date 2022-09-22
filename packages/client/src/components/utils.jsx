/* eslint-disable no-restricted-syntax */
import { useEffect, useRef } from 'react';

export function classNames(...rest) {
  const classes = [];
  const hasOwn = {}.hasOwnProperty;
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];

    if (arg) {
      const argType = typeof arg;

      if (argType === 'string' || argType === 'number') {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        if (arg.length) {
          // eslint-disable-next-line prefer-spread
          const inner = classNames.apply(null, arg);
          if (inner) {
            classes.push(inner);
          }
        }
      } else if (argType === 'object') {
        if (arg.toString !== Object.prototype.toString) {
          classes.push(arg.toString());
        } else {
          for (const key in arg) {
            if (hasOwn.call(arg, key) && arg[key]) {
              classes.push(key);
            }
          }
        }
      }
    }
  }

  return classes.join(' ');
}

export function useCombinedRefs(...refs) {
  const targetRef = useRef();

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

export const sortOptions = (array = [], sortKey) => {
  if (!Array.isArray(array)) return [];

  return array.sort((a, b) => {
    const left = a[sortKey] ?? Number.MAX_SAFE_INTEGER;
    const right = b[sortKey] ?? Number.MAX_SAFE_INTEGER;
    return left - right;
  });
};

export const regex = {
  string: /^[A-Za-z .]+$/,
  firstSpace: /^[A-Za-z.]+$/,
  number: /^-?\d*\.?\d{0,6}$/,
  decimalFloatDouble: /^(?!0\d)\d*(\.\d*)?$/,
  positive: /^\d*[0-9]\d*$/,
  notZeroPositive: /^[1-9][0-9]*$/,
  negative: /^-\d*\.?\d{0,6}$/,
  percentage: /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/,
  website: /^[-., A-Za-z0-9]+$/,
  alphanum: /^[a-zA-Z0-9]$/,
  integer: /^[-+]?\d*$/,
  posNegDecimalFloatDouble: /^[-+]?(?!0\d)\d*(\.\d*)?$/,
};
