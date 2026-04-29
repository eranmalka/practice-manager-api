/** Safe trim for ValidationPipe / DTO transforms (avoids eslint no-unsafe-return on `value: any`). */
export function trimIfString({ value }: { value: unknown }): unknown {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}
